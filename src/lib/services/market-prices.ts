/**
 * Service to fetch live market prices for SJC/DOJI Gold, Crypto, and Vietnamese Stocks.
 */

async function fetchGoldPrice(ticker: string): Promise<number | null> {
  try {
    const res = await fetch('https://www.vang.today/api/prices', {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // cache for 1 minute in Next.js fetch cache
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !data.prices) return null;
    
    const cleanTicker = ticker.toUpperCase().replace(/\s+/g, '');
    
    // Map common tickers to Vang.today keys
    const tickerMap: Record<string, string> = {
      'SJC': 'SJ9999',
      'DOJI': 'DOJINHTV',
      'BT9999': 'BT9999NTT',
      'BTSJC': 'BTSJC',
    };
    
    const key = tickerMap[cleanTicker] || cleanTicker;
    
    if (data.prices[key]) {
      const priceObj = data.prices[key];
      // local gold prices are in VND per tael/ lượng (e.g. 154,500,000 VND).
      return priceObj.sell > 0 ? priceObj.sell : priceObj.buy;
    }
    
    // Substring fallback
    for (const [k, p] of Object.entries(data.prices)) {
      if (k.includes(cleanTicker) || (p as any).name?.toUpperCase().includes(cleanTicker)) {
        const priceObj = p as any;
        return priceObj.sell > 0 ? priceObj.sell : priceObj.buy;
      }
    }
    
    return null;
  } catch (err) {
    console.error('Error fetching gold price:', err);
    return null;
  }
}

async function fetchCryptoPrice(ticker: string): Promise<number | null> {
  try {
    let cleanTicker = ticker.toUpperCase().replace(/\s+/g, '');
    if (cleanTicker.endsWith('USDT') && cleanTicker !== 'USDT') {
      cleanTicker = cleanTicker.slice(0, -4);
    }
    // Fetch price in USDT
    const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${cleanTicker}USDT`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.price) {
      const priceUsd = parseFloat(data.price);
      // Fixed VND rate conversion of 25,000 VND/USD
      return priceUsd * 25000;
    }
    return null;
  } catch (err) {
    console.error('Error fetching crypto price:', err);
    return null;
  }
}

async function fetchStockPrice(ticker: string): Promise<number | null> {
  try {
    const cleanTicker = ticker.toUpperCase().replace(/\s+/g, '');
    // Yahoo finance ticker for VN stocks is TICKER.VN
    const symbol = cleanTicker.endsWith('.VN') ? cleanTicker : `${cleanTicker}.VN`;
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (result && result.meta && typeof result.meta.regularMarketPrice === 'number') {
      return result.meta.regularMarketPrice;
    }
    return null;
  } catch (err) {
    console.error('Error fetching stock price:', err);
    return null;
  }
}

/**
 * Fetch the latest market price of a given ticker based on asset category name.
 * If fetching fails, returns null.
 */
export async function fetchLivePrice(ticker: string, categoryName?: string): Promise<number | null> {
  if (!ticker) return null;
  const cat = categoryName?.toLowerCase() || '';
  
  if (cat.includes('vàng') || cat.includes('gold')) {
    return fetchGoldPrice(ticker);
  } else if (
    cat.includes('crypto') || 
    cat.includes('tiền mã hóa') || 
    cat.includes('coin') || 
    ['BTC', 'ETH', 'BNB', 'SOL', 'USDT'].includes(ticker.toUpperCase())
  ) {
    return fetchCryptoPrice(ticker);
  } else {
    // Default to stocks (Yahoo Finance) since most investment tickers are stocks
    const stockPrice = await fetchStockPrice(ticker);
    if (stockPrice !== null) return stockPrice;
    
    // Try crypto as fallback if stock fails
    return fetchCryptoPrice(ticker);
  }
}
