import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';

// Configuration Firebase (utilise les variables d'environnement)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Service Firebase pour les portfolios
export class FirebaseService {
  
  /**
   * Initialise l'authentification anonyme si nécessaire
   */
  static async initAuth() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        
        if (user) {
          console.log('🔐 Utilisateur connecté:', user.uid);
          resolve(user);
        } else {
          try {
            console.log('🔐 Connexion anonyme...');
            const userCredential = await signInAnonymously(auth);
            console.log('✅ Connexion anonyme réussie:', userCredential.user.uid);
            resolve(userCredential.user);
          } catch (error) {
            console.error('❌ Erreur connexion anonyme:', error);
            reject(error);
          }
        }
      });
    });
  }

  /**
   * Sauvegarde les allocations du portfolio dans Firestore
   * @param {Object} allocations - Les allocations du portfolio
   * @returns {Promise<boolean>} Succès de la sauvegarde
   */
  static async savePortfolioAllocations(allocations) {
    try {
      // S'assurer que l'utilisateur est connecté
      const user = await this.initAuth();
      
      const portfolioData = {
        ...allocations,
        lastUpdated: serverTimestamp(),
        userId: user.uid,
        version: '1.0'
      };

      // Sauvegarder dans portfolios/{userId}/allocations/current
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      await setDoc(docRef, portfolioData);
      
      console.log('💾 Allocations sauvegardées:', portfolioData);
      
      // Optionnel : Ajouter à l'historique
      await this.addToHistory(user.uid, allocations);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde allocations:', error);
      return false;
    }
  }

  /**
   * Récupère les allocations du portfolio depuis Firestore
   * @returns {Promise<Object|null>} Les allocations ou null si pas trouvées
   */
  static async getPortfolioAllocations() {
    try {
      // S'assurer que l'utilisateur est connecté
      const user = await this.initAuth();
      
      const docRef = doc(db, 'portfolios', user.uid, 'allocations', 'current');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('📥 Allocations récupérées:', data);
        
        // Retourner seulement les allocations (sans métadonnées)
        const { lastUpdated, userId, version, ...allocations } = data;
        return {
          allocations,
          metadata: { lastUpdated, userId, version }
        };
      } else {
        console.log('📭 Aucune allocation trouvée, utilisation des valeurs par défaut');
        return null;
      }
    } catch (error) {
      console.error('❌ Erreur récupération allocations:', error);
      return null;
    }
  }

  /**
   * Ajoute une entrée à l'historique des modifications
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} allocations - Les allocations à historiser
   */
  static async addToHistory(userId, allocations) {
    try {
      const historyRef = collection(db, 'portfolios', userId, 'history');
      await addDoc(historyRef, {
        allocations,
        timestamp: serverTimestamp(),
        action: 'allocation_update'
      });
      
      console.log('📚 Ajouté à l\'historique');
    } catch (error) {
      console.error('❌ Erreur ajout historique:', error);
    }
  }

  /**
   * Récupère l'historique des modifications (optionnel)
   * @param {number} limitCount - Nombre d'entrées à récupérer
   * @returns {Promise<Array>} Historique des modifications
   */
  static async getPortfolioHistory(limitCount = 10) {
    try {
      const user = await this.initAuth();
      
      const historyRef = collection(db, 'portfolios', user.uid, 'history');
      const q = query(historyRef, orderBy('timestamp', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log('📚 Historique récupéré:', history.length, 'entrées');
      return history;
    } catch (error) {
      console.error('❌ Erreur récupération historique:', error);
      return [];
    }
  }

  /**
   * Teste la connectivité Firebase
   * @returns {Promise<boolean>} État de la connexion
   */
  static async testConnection() {
    try {
      const user = await this.initAuth();
      console.log('🔥 Firebase connecté, utilisateur:', user.uid);
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion Firebase:', error);
      return false;
    }
  }

  /**
   * Réinitialise les allocations aux valeurs par défaut
   * @returns {Promise<boolean>} Succès de la réinitialisation
   */
  static async resetToDefaults() {
    const defaultAllocations = {
      stocks: 60,
      bonds: 25,
      commodities: 10,
      cash: 5
    };
    
    return await this.savePortfolioAllocations(defaultAllocations);
  }
}

// Export par défaut
export default FirebaseService;

