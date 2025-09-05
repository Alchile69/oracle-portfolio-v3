import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';

// Configuration Firebase (à remplacer par vos vraies clés)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "oracle-portfolio-v3.firebaseapp.com",
  projectId: "oracle-portfolio-v3",
  storageBucket: "oracle-portfolio-v3.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

class FirebaseService {
  constructor() {
    this.auth = auth;
    this.db = db;
    this.currentUser = null;
    
    // Écouter les changements d'authentification
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      console.log('État d\'authentification changé:', user ? 'Connecté' : 'Déconnecté');
    });
  }

  // Authentification anonyme
  async signInAnonymously() {
    try {
      const result = await signInAnonymously(auth);
      console.log('✅ Authentification anonyme réussie:', result.user.uid);
      return result;
    } catch (error) {
      console.error('❌ Erreur authentification anonyme:', error);
      throw error;
    }
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    return this.currentUser;
  }

  // Sauvegarder les données du portefeuille
  async savePortfolioData(userId, portfolioData) {
    try {
      const docRef = doc(this.db, 'portfolios', userId);
      await setDoc(docRef, {
        ...portfolioData,
        lastUpdated: new Date(),
        version: 'WOW_V1'
      }, { merge: true });
      
      console.log('✅ Données du portefeuille sauvegardées');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde portefeuille:', error);
      throw error;
    }
  }

  // Récupérer les données du portefeuille
  async getPortfolioData(userId) {
    try {
      const docRef = doc(this.db, 'portfolios', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('✅ Données du portefeuille récupérées');
        return docSnap.data();
      } else {
        console.log('ℹ️ Aucune donnée de portefeuille trouvée');
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur récupération portefeuille:', error);
      throw error;
    }
  }

  // Sauvegarder les résultats de backtesting
  async saveBacktestResults(userId, backtestData) {
    try {
      const backtestsRef = collection(this.db, 'backtests');
      const docRef = await addDoc(backtestsRef, {
        userId: userId,
        ...backtestData,
        createdAt: new Date(),
        version: 'WOW_V1'
      });
      
      console.log('✅ Résultats de backtesting sauvegardés:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Erreur sauvegarde backtesting:', error);
      throw error;
    }
  }

  // Récupérer l'historique des backtests
  async getBacktestHistory(userId, limitCount = 10) {
    try {
      const backtestsRef = collection(this.db, 'backtests');
      const q = query(
        backtestsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const backtests = [];
      
      querySnapshot.forEach((doc) => {
        if (doc.data().userId === userId) {
          backtests.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
      
      console.log(`✅ ${backtests.length} backtests récupérés`);
      return backtests;
    } catch (error) {
      console.error('❌ Erreur récupération historique backtests:', error);
      throw error;
    }
  }

  // Sauvegarder la configuration utilisateur
  async saveUserConfig(userId, config) {
    try {
      const docRef = doc(this.db, 'userConfigs', userId);
      await setDoc(docRef, {
        ...config,
        lastUpdated: new Date()
      }, { merge: true });
      
      console.log('✅ Configuration utilisateur sauvegardée');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde configuration:', error);
      throw error;
    }
  }

  // Récupérer la configuration utilisateur
  async getUserConfig(userId) {
    try {
      const docRef = doc(this.db, 'userConfigs', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('✅ Configuration utilisateur récupérée');
        return docSnap.data();
      } else {
        console.log('ℹ️ Configuration par défaut utilisée');
        return this.getDefaultConfig();
      }
    } catch (error) {
      console.error('❌ Erreur récupération configuration:', error);
      return this.getDefaultConfig();
    }
  }

  // Configuration par défaut
  getDefaultConfig() {
    return {
      portfolio: {
        riskTolerance: 'moderate',
        rebalanceFrequency: 'quarterly',
        currency: 'EUR',
        notifications: true
      },
      display: {
        theme: 'dark',
        language: 'fr',
        chartType: 'line',
        showAnimations: true
      },
      trading: {
        transactionFees: 0.1,
        slippage: 0.05,
        dividendReinvestment: true,
        autoRebalance: false
      }
    };
  }

  // Enregistrer une activité utilisateur
  async logActivity(userId, activity) {
    try {
      const activitiesRef = collection(this.db, 'activities');
      await addDoc(activitiesRef, {
        userId: userId,
        activity: activity,
        timestamp: new Date(),
        version: 'WOW_V1'
      });
      
      console.log('✅ Activité enregistrée:', activity);
    } catch (error) {
      console.error('❌ Erreur enregistrement activité:', error);
    }
  }

  // Obtenir les données de démonstration
  getDemoData() {
    return {
      portfolioValue: 125000,
      totalReturn: 8.5,
      volatility: 12.3,
      sharpeRatio: 0.69,
      maxDrawdown: -15.2,
      winRate: 62.5,
      beta: 0.95,
      assets: [
        { symbol: 'AAPL', name: 'Apple Inc.', allocation: 12.5, value: 15625 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', allocation: 10.0, value: 12500 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', allocation: 9.0, value: 11250 },
        { symbol: 'TSLA', name: 'Tesla Inc.', allocation: 7.5, value: 9375 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', allocation: 6.0, value: 7500 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', allocation: 5.0, value: 6250 },
        { symbol: 'META', name: 'Meta Platforms Inc.', allocation: 4.5, value: 5625 },
        { symbol: 'NFLX', name: 'Netflix Inc.', allocation: 4.0, value: 5000 },
        { symbol: 'AMD', name: 'Advanced Micro Devices', allocation: 3.8, value: 4750 },
        { symbol: 'CRM', name: 'Salesforce Inc.', allocation: 3.5, value: 4375 },
        { symbol: 'ADBE', name: 'Adobe Inc.', allocation: 3.2, value: 4000 },
        { symbol: 'PYPL', name: 'PayPal Holdings Inc.', allocation: 3.0, value: 3750 },
        { symbol: 'INTC', name: 'Intel Corporation', allocation: 2.8, value: 3500 },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.', allocation: 2.5, value: 3125 },
        { symbol: 'ORCL', name: 'Oracle Corporation', allocation: 2.3, value: 2875 },
        { symbol: 'IBM', name: 'International Business Machines', allocation: 2.0, value: 2500 },
        { symbol: 'QCOM', name: 'Qualcomm Inc.', allocation: 1.8, value: 2250 },
        { symbol: 'UBER', name: 'Uber Technologies Inc.', allocation: 1.5, value: 1875 },
        { symbol: 'SPOT', name: 'Spotify Technology SA', allocation: 1.2, value: 1500 },
        { symbol: 'ZOOM', name: 'Zoom Video Communications', allocation: 1.0, value: 1250 }
      ],
      countries: [
        { country: 'USA', allocation: 70, value: 87500 },
        { country: 'Europe', allocation: 20, value: 25000 },
        { country: 'Asia', allocation: 10, value: 12500 }
      ],
      lastUpdated: new Date()
    };
  }
}

// Instance singleton
export const firebaseService = new FirebaseService();
export default firebaseService;

