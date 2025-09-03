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
        { symbol: 'AAPL', name: 'Apple Inc.', allocation: 25, value: 31250 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', allocation: 20, value: 25000 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', allocation: 18, value: 22500 },
        { symbol: 'TSLA', name: 'Tesla Inc.', allocation: 15, value: 18750 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', allocation: 12, value: 15000 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', allocation: 10, value: 12500 }
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

