import React, { useState, useEffect } from 'react';
import { firebaseService } from '../../services/firebaseService';
import './ScreeningTable.css';

const ScreeningTable = ({ data, user }) => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    minAllocation: 0,
    maxAllocation: 100,
    sector: 'all'
  });

  // Colonnes de la table
  const columns = [
    { key: 'symbol', label: 'Symbole', sortable: true },
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'allocation', label: 'Allocation (%)', sortable: true },
    { key: 'value', label: 'Valeur (€)', sortable: true },
    { key: 'sector', label: 'Secteur', sortable: true },
    { key: 'change24h', label: 'Var. 24h (%)', sortable: true },
    { key: 'marketCap', label: 'Cap. Marché', sortable: true }
  ];

  // Chargement des données
  useEffect(() => {
    const loadTableData = async () => {
      setLoading(true);
      try {
        let portfolioData = data;
        
        if (!portfolioData && user) {
          portfolioData = await firebaseService.getPortfolioData(user.uid);
        }
        
        if (!portfolioData) {
          portfolioData = firebaseService.getDemoData();
        }
        
        // Enrichir les données avec des informations supplémentaires
        const enrichedAssets = portfolioData.assets?.map(asset => ({
          ...asset,
          sector: getSectorForSymbol(asset.symbol),
          change24h: (Math.random() - 0.5) * 10, // Simulation
          marketCap: Math.random() * 1000000000000 // Simulation
        })) || [];
        
        setTableData(enrichedAssets);
        setFilteredData(enrichedAssets);
        
        if (user) {
          await firebaseService.logActivity(user.uid, 'Viewed Screening Table');
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement de la table:', error);
        setTableData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTableData();
  }, [data, user]);

  // Fonction pour obtenir le secteur d'un symbole (simulation)
  const getSectorForSymbol = (symbol) => {
    const sectors = {
      'AAPL': 'Technology',
      'GOOGL': 'Technology',
      'MSFT': 'Technology',
      'TSLA': 'Automotive',
      'AMZN': 'E-commerce',
      'NVDA': 'Technology',
      'META': 'Technology',
      'NFLX': 'Entertainment',
      'AMD': 'Technology',
      'CRM': 'Technology',
      'ADBE': 'Technology',
      'PYPL': 'Financial Services',
      'INTC': 'Technology',
      'CSCO': 'Technology',
      'ORCL': 'Technology',
      'IBM': 'Technology',
      'QCOM': 'Technology',
      'UBER': 'Transportation',
      'SPOT': 'Entertainment',
      'ZOOM': 'Technology'
    };
    return sectors[symbol] || 'Other';
  };

  // Filtrage et recherche
  useEffect(() => {
    let filtered = tableData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAllocation = item.allocation >= filters.minAllocation && 
                               item.allocation <= filters.maxAllocation;
      const matchesSector = filters.sector === 'all' || item.sector === filters.sector;
      
      return matchesSearch && matchesAllocation && matchesSector;
    });

    // Tri
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [tableData, searchTerm, filters, sortConfig]);

  // Gestion du tri
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Gestion des filtres
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Export des données
  const exportData = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...filteredData.map(row => 
        columns.map(col => row[col.key]).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_screening.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Formatage des valeurs
  const formatValue = (value, key) => {
    switch (key) {
      case 'value':
        return value?.toLocaleString() + '€';
      case 'allocation':
        return value?.toFixed(1) + '%';
      case 'change24h':
        return (value >= 0 ? '+' : '') + value?.toFixed(2) + '%';
      case 'marketCap':
        return (value / 1000000000).toFixed(1) + 'B€';
      default:
        return value;
    }
  };

  // Classe CSS pour les valeurs
  const getValueClass = (value, key) => {
    if (key === 'change24h') {
      return value >= 0 ? 'positive' : 'negative';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="screening-table-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de la table de screening...</p>
      </div>
    );
  }

  return (
    <div className="screening-table-container">
      {/* Header */}
      <div className="screening-table-header">
        <h3>🔍 Screening Table</h3>
        <p>Filtrage avancé multi-critères avec recherche et tri dynamique</p>
      </div>

      {/* Contrôles */}
      <div className="table-controls">
        {/* Recherche */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom ou symbole..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Filtres */}
        <div className="filters-container">
          <div className="filter-group">
            <label>Allocation min (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.minAllocation}
              onChange={(e) => updateFilter('minAllocation', parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="filter-group">
            <label>Allocation max (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.maxAllocation}
              onChange={(e) => updateFilter('maxAllocation', parseFloat(e.target.value) || 100)}
            />
          </div>
          
          <div className="filter-group">
            <label>Secteur</label>
            <select 
              value={filters.sector} 
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
            >
              <option value="all">Tous</option>
              <option value="Technology">Technology</option>
              <option value="Automotive">Automotive</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="table-actions">
          <button onClick={exportData} className="export-btn">
            📥 Exporter CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="screening-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable ? 'sortable' : ''}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.label}
                  {column.sortable && (
                    <span className="sort-indicator">
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? '↑' : '↓'
                      ) : '↕️'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={row.symbol} className={index % 2 === 0 ? 'even' : 'odd'}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={getValueClass(row[column.key], column.key)}
                  >
                    {formatValue(row[column.key], column.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <div className="pagination-info">
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredData.length)} sur {filteredData.length} éléments
        </div>
        
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ← Précédent
          </button>
          
          <span className="page-info">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Suivant →
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="table-stats">
        <div className="stat-item">
          <span className="stat-label">Total des actifs:</span>
          <span className="stat-value">{tableData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Actifs filtrés:</span>
          <span className="stat-value">{filteredData.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Valeur totale filtrée:</span>
          <span className="stat-value">
            {filteredData.reduce((sum, item) => sum + (item.value || 0), 0).toLocaleString()}€
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScreeningTable;

