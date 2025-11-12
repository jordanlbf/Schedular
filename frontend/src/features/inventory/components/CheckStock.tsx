import { Header, ActionBar, Footer } from '@/app/layout';
import { useInventoryTable } from '../hooks';
import { getStockHealth } from '../utils';
import { getCategoryIcon } from '../constants';
import { SortIcon } from './SortIcon';
import '../styles/check-stock.css';

export default function CheckStock() {
  // Mock data - to be replaced with API integration
  const products = [
    { sku: 'MAT-001', name: 'Premium Orthopedic Mattress', category: 'Mattresses', price: 1299.00, stock: 15 },
    { sku: 'SOF-002', name: 'Modern Leather Sofa', category: 'Sofas', price: 2499.00, stock: 3 },
    { sku: 'BED-003', name: 'Oak Platform Bed Frame', category: 'Beds', price: 899.00, stock: 0 },
    { sku: 'TBL-004', name: 'Glass Dining Table', category: 'Tables', price: 699.00, stock: 8 },
    { sku: 'CHR-005', name: 'Ergonomic Office Chair', category: 'Chairs', price: 449.00, stock: 2 },
    { sku: 'DRS-006', name: 'Walnut Dresser', category: 'Storage', price: 1099.00, stock: 6 },
    { sku: 'LMP-007', name: 'Modern Floor Lamp', category: 'Lighting', price: 179.00, stock: 12 },
    { sku: 'RUG-008', name: 'Persian Area Rug', category: 'Decor', price: 599.00, stock: 0 },
    { sku: 'DSK-009', name: 'Standing Desk', category: 'Tables', price: 799.00, stock: 4 },
    { sku: 'COU-010', name: 'Velvet Accent Chair', category: 'Chairs', price: 349.00, stock: 7 },
  ];

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDir,
    handleSort,
    filteredProducts,
  } = useInventoryTable({ products });

  return (
    <>
      <div className="check-stock-page-wrapper">
        <Header title="Inventory" />
        <main className="check-stock-page">
          <div className="check-stock-container">
            {/* Search Bar */}
            <div className="check-stock-controls">
              <div className="controls-inner">
                <div className="search-wrapper">
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="stock-table-card">
              <div className="table-wrapper">
                <div className="stock-table-scroll">
                  <table className="stock-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} className="sortable">
                          <div className="th-content">
                            Product <SortIcon column="name" currentColumn={sortBy} direction={sortDir} />
                          </div>
                        </th>
                        <th onClick={() => handleSort('category')} className="sortable">
                          <div className="th-content">
                            Category <SortIcon column="category" currentColumn={sortBy} direction={sortDir} />
                          </div>
                        </th>
                        <th onClick={() => handleSort('price')} className="sortable text-right">
                          <div className="th-content">
                            Price <SortIcon column="price" currentColumn={sortBy} direction={sortDir} />
                          </div>
                        </th>
                        <th onClick={() => handleSort('stock')} className="sortable">
                          <div className="th-content">
                            Stock <SortIcon column="stock" currentColumn={sortBy} direction={sortDir} />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => {
                        const { percentage, healthClass } = getStockHealth(product.stock);
                        const icon = getCategoryIcon(product.category);
                        
                        return (
                          <tr key={product.sku}>
                            <td>
                              <div className="product-cell">
                                <div className="product-image">
                                  {icon}
                                </div>
                                <div className="product-info">
                                  <div className="product-name">{product.name}</div>
                                  <div className="product-sku">{product.sku}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="category-badge">{product.category}</span>
                            </td>
                            <td className="text-right">
                              <span className="price-text">${product.price.toFixed(2)}</span>
                            </td>
                            <td>
                              <div className="qty-indicator">
                                <div className="qty-bar">
                                  <div 
                                    className={`qty-fill ${healthClass}`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="qty-text">{product.stock}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredProducts.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3 className="empty-title">No products found</h3>
                  <p className="empty-text">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="footer-stats">
              Showing <span className="stat-highlight">{filteredProducts.length}</span> of <span className="stat-highlight">{products.length}</span> products
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <ActionBar />
    </>
  );
}
