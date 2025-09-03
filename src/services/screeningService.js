/**
 * Service de Screening avec données réelles
 * Utilise FMP, Alpha Vantage et Yahoo Finance avec gestion des limites
 */

class ScreeningService {
  constructor() {
    // Configuration des APIs
    this.apis = {
      fmp: {
        baseUrl: 'https://financialmodelingprep.com/api/v3',
        key: process.env.REACT_APP_FMP_API_KEY || 'demo',
        rateLimit: 250, // 250 calls/day for free
        lastCall: 0,
        minInterval: 1000 // 1 seconde entre les appels
      },
      alphaVantage: {
        baseUrl: 'https://www.alphavantage.co/query',
        key: process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo',
        rateLimit: 5, // 5 calls/minute for free
        lastCall: 0,
        minInterval: 12000, // 12 secondes entre les appels
        callsThisMinute: 0,
        minuteStart: Date.now()
      },
      yahoo: {
        baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
        rateLimit: 2000, // Très généreux
        lastCall: 0,
        minInterval: 100 // 100ms entre les appels
      }
    };

    // Cache des données
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes

    // Symboles populaires pour le screening
    this.topSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM',
      'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'PYPL',
      'ADBE', 'NFLX', 'CRM', 'INTC', 'AMD', 'ORCL', 'CSCO', 'PFE'
    ];

    // Secteurs mapping
    this.sectorMapping = {
      'Technology': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 'ADBE', 'INTC', 'AMD', 'ORCL', 'CSCO'],
      'Consumer Discretionary': ['AMZN', 'TSLA', 'HD', 'DIS', 'NFLX'],
      'Financial Services': ['JPM', 'V', 'MA', 'PYPL'],
      'Healthcare': ['JNJ', 'UNH', 'PFE'],
      'Consumer Staples': ['PG'],
      'Communication Services': ['CRM']
    };
  }

  /**
   * Gestion du rate limiting
   */
  async waitForRateLimit(apiName) {
    const api = this.apis[apiName];
    const now = Date.now();
    
    if (apiName === 'alphaVantage') {
      // Gestion spéciale pour Alpha Vantage (5 calls/minute)
      if (now - api.minuteStart > 60000) {
        api.callsThisMinute = 0;
        api.minuteStart = now;
      }
      
      if (api.callsThisMinute >= api.rateLimit) {
        const waitTime = 60000 - (now - api.minuteStart);
        console.log(`⏳ Alpha Vantage rate limit atteint, attente ${Math.ceil(waitTime/1000)}s`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        api.callsThisMinute = 0;
        api.minuteStart = Date.now();
      }
      
      api.callsThisMinute++;
    }
    
    // Attente minimum entre les appels
    const timeSinceLastCall = now - api.lastCall;
    if (timeSinceLastCall < api.minInterval) {
      await new Promise(resolve => setTimeout(resolve, api.minInterval - timeSinceLastCall));
    }
    
    api.lastCall = Date.now();
  }

  /**
   * Cache intelligent
   */
  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Obtenir les données de base d'un actif via FMP
   */
  async getStockData(symbol) {
    const cacheKey = `stock_${symbol}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      await this.waitForRateLimit('fmp');
      
      const response = await fetch(
        `${this.apis.fmp.baseUrl}/quote/${symbol}?apikey=${this.apis.fmp.key}`
      );
      
      if (!response.ok) throw new Error(`FMP API error: ${response.status}`);
      
      const data = await response.json();
      if (data && data.length > 0) {
        const stockData = data[0];
        const result = {
          symbol: stockData.symbol,
          name: stockData.name,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changesPercentage,
          volume: this.formatVolume(stockData.volume),
          marketCap: this.formatMarketCap(stockData.marketCap),
          pe: stockData.pe || 'N/A',
          sector: this.getSector(symbol),
          source: 'FMP'
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn(`❌ Erreur FMP pour ${symbol}:`, error.message);
    }

    return null;
  }

  /**
   * Obtenir les données via Alpha Vantage (fallback)
   */
  async getStockDataAlphaVantage(symbol) {
    const cacheKey = `alpha_${symbol}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      await this.waitForRateLimit('alphaVantage');
      
      const response = await fetch(
        `${this.apis.alphaVantage.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apis.alphaVantage.key}`
      );
      
      if (!response.ok) throw new Error(`Alpha Vantage API error: ${response.status}`);
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (quote && quote['01. symbol']) {
        const result = {
          symbol: quote['01. symbol'],
          name: this.getCompanyName(symbol),
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
          volume: this.formatVolume(parseInt(quote['06. volume'])),
          marketCap: 'N/A',
          pe: 'N/A',
          sector: this.getSector(symbol),
          source: 'Alpha Vantage'
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn(`❌ Erreur Alpha Vantage pour ${symbol}:`, error.message);
    }

    return null;
  }

  /**
   * Obtenir les données via Yahoo Finance (fallback)
   */
  async getStockDataYahoo(symbol) {
    const cacheKey = `yahoo_${symbol}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      await this.waitForRateLimit('yahoo');
      
      const response = await fetch(
        `${this.apis.yahoo.baseUrl}/${symbol}?interval=1d&range=1d`
      );
      
      if (!response.ok) throw new Error(`Yahoo API error: ${response.status}`);
      
      const data = await response.json();
      const result = data.chart.result[0];
      
      if (result && result.meta) {
        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        const stockData = {
          symbol: meta.symbol,
          name: this.getCompanyName(symbol),
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          volume: this.formatVolume(meta.regularMarketVolume),
          marketCap: 'N/A',
          pe: 'N/A',
          sector: this.getSector(symbol),
          source: 'Yahoo Finance'
        };
        
        this.setCache(cacheKey, stockData);
        return stockData;
      }
    } catch (error) {
      console.warn(`❌ Erreur Yahoo Finance pour ${symbol}:`, error.message);
    }

    return null;
  }

  /**
   * Calculer le score de screening
   */
  calculateScore(stockData) {
    let score = 50; // Score de base
    
    // Performance (40% du score)
    if (stockData.changePercent > 5) score += 20;
    else if (stockData.changePercent > 2) score += 15;
    else if (stockData.changePercent > 0) score += 10;
    else if (stockData.changePercent > -2) score += 5;
    else if (stockData.changePercent < -5) score -= 15;
    
    // P/E Ratio (30% du score)
    if (stockData.pe && stockData.pe !== 'N/A') {
      const pe = parseFloat(stockData.pe);
      if (pe > 0 && pe < 15) score += 15;
      else if (pe >= 15 && pe < 25) score += 10;
      else if (pe >= 25 && pe < 35) score += 5;
      else if (pe >= 35) score -= 5;
    }
    
    // Secteur (20% du score)
    if (stockData.sector === 'Technology') score += 10;
    else if (stockData.sector === 'Healthcare') score += 8;
    else if (stockData.sector === 'Financial Services') score += 6;
    
    // Volume (10% du score)
    const volumeStr = stockData.volume.toString();
    if (volumeStr.includes('M') && parseFloat(volumeStr) > 10) score += 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Générer une recommandation
   */
  getRecommendation(score, changePercent) {
    if (score >= 85 && changePercent > 0) return 'BUY';
    if (score >= 70) return 'BUY';
    if (score >= 60) return 'HOLD';
    if (score >= 40) return 'HOLD';
    return 'SELL';
  }

  /**
   * Obtenir les données de screening pour plusieurs actifs
   */
  async getScreeningData(symbols = null, maxResults = 10) {
    const targetSymbols = symbols || this.topSymbols.slice(0, maxResults);
    const results = [];
    
    console.log(`🔍 Début du screening pour ${targetSymbols.length} actifs...`);
    
    for (const symbol of targetSymbols) {
      try {
        // Essayer FMP en premier
        let stockData = await this.getStockData(symbol);
        
        // Fallback vers Alpha Vantage si FMP échoue
        if (!stockData) {
          stockData = await this.getStockDataAlphaVantage(symbol);
        }
        
        // Fallback vers Yahoo Finance si Alpha Vantage échoue
        if (!stockData) {
          stockData = await this.getStockDataYahoo(symbol);
        }
        
        if (stockData) {
          // Calculer le score et la recommandation
          const score = this.calculateScore(stockData);
          const recommendation = this.getRecommendation(score, stockData.changePercent);
          
          results.push({
            ...stockData,
            score,
            recommendation
          });
          
          console.log(`✅ ${symbol}: ${stockData.price} (${stockData.changePercent.toFixed(2)}%) - Score: ${score}`);
        } else {
          console.warn(`❌ Impossible d'obtenir les données pour ${symbol}`);
        }
        
        // Petite pause entre les symboles pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Erreur pour ${symbol}:`, error);
      }
    }
    
    // Trier par score décroissant
    results.sort((a, b) => b.score - a.score);
    
    console.log(`🎯 Screening terminé: ${results.length}/${targetSymbols.length} actifs récupérés`);
    
    return results;
  }

  /**
   * Utilitaires
   */
  formatVolume(volume) {
    if (!volume || volume === 0) return 'N/A';
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  }

  formatMarketCap(marketCap) {
    if (!marketCap || marketCap === 0) return 'N/A';
    if (marketCap >= 1000000000000) return `${(marketCap / 1000000000000).toFixed(2)}T`;
    if (marketCap >= 1000000000) return `${(marketCap / 1000000000).toFixed(0)}B`;
    if (marketCap >= 1000000) return `${(marketCap / 1000000).toFixed(0)}M`;
    return marketCap.toString();
  }

  getSector(symbol) {
    for (const [sector, symbols] of Object.entries(this.sectorMapping)) {
      if (symbols.includes(symbol)) return sector;
    }
    return 'Other';
  }

  getCompanyName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corp.',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms',
      'NVDA': 'NVIDIA Corp.',
      'JPM': 'JPMorgan Chase',
      'JNJ': 'Johnson & Johnson',
      'V': 'Visa Inc.',
      'PG': 'Procter & Gamble',
      'UNH': 'UnitedHealth Group',
      'HD': 'Home Depot',
      'MA': 'Mastercard Inc.',
      'DIS': 'Walt Disney Co.',
      'PYPL': 'PayPal Holdings',
      'ADBE': 'Adobe Inc.',
      'NFLX': 'Netflix Inc.',
      'CRM': 'Salesforce Inc.',
      'INTC': 'Intel Corp.',
      'AMD': 'Advanced Micro Devices',
      'ORCL': 'Oracle Corp.',
      'CSCO': 'Cisco Systems',
      'PFE': 'Pfizer Inc.'
    };
    return names[symbol] || `${symbol} Corp.`;
  }

  /**
   * Obtenir les statistiques du cache
   */
  getCacheStats() {
    const total = this.cache.size;
    const expired = Array.from(this.cache.values())
      .filter(item => Date.now() - item.timestamp > this.cacheExpiry).length;
    
    return {
      total,
      active: total - expired,
      expired,
      hitRate: total > 0 ? ((total - expired) / total * 100).toFixed(1) : 0
    };
  }

  /**
   * Nettoyer le cache expiré
   */
  cleanCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Instance singleton
const screeningService = new ScreeningService();

export default screeningService;

