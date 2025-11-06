'use client';

import React, { useState, useEffect } from 'react';
import { InvestorDashboardData, InvestmentHistoryItem, DividendHistoryItem } from '@/types/investment.types';
import investmentService from '@/services/investment.service';

const InvestorPortfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<InvestorDashboardData | null>(null);
  const [investments, setInvestments] = useState<InvestmentHistoryItem[]>([]);
  const [dividends, setDividends] = useState<DividendHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'dividends'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDividendModal, setShowDividendModal] = useState(false);
  const [dividendProject, setDividendProject] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [portfolioResponse, investmentsResponse, dividendsResponse] = await Promise.all([
        investmentService.getInvestorPortfolio(), // Use the correct method that returns InvestorPortfolio object
        investmentService.getInvestmentHistory(),
        investmentService.getDividendHistory(),
      ]);

      // portfolioResponse is now an InvestorPortfolio object, not an array
      // Convert backend investment structure to PortfolioItem format
      const portfolioItems = (portfolioResponse.investments || []).map((item: any) => ({
        id: item.investment.id,
        amount: item.investment.amount,
        investorId: item.investment.investorId,
        investor: item.investment.investor,
        projectId: item.investment.projectId,
        project: {
          ...item.project,
          totalInvestment: item.project.totalInvestment || 0
        },
        investorShare: item.investment.investorShare || 0,
        totalDividends: item.dividendsReceived || 0,
        createdAt: new Date(item.investment.createdAt)
      }));

      // Calculate totals based on fetched data
      const totalDividendsReceivedCalc = (dividendsResponse || []).reduce(
        (sum: number, d: any) => sum + (d.investorDividend || 0),
        0
      );
      const totalInvestedCalc = portfolioResponse.totalInvested || 0;
      const roiCalc = totalInvestedCalc > 0 ? (totalDividendsReceivedCalc / totalInvestedCalc) * 100 : 0;

      const dashboardData: InvestorDashboardData = {
        portfolio: portfolioItems,
        totalInvested: totalInvestedCalc,
        totalDividendsReceived: totalDividendsReceivedCalc,
        activeInvestments: portfolioResponse.activeInvestments || 0,
        availableProjects: portfolioResponse.availableProjects || [],
        totalReturn: totalDividendsReceivedCalc,
        roi: roiCalc,
        activeProjects: portfolioResponse.activeProjects || 0,
        projectBreakdown: portfolioResponse.projectBreakdown || []
      };

      setPortfolio(dashboardData);
      setInvestments(investmentsResponse);
      setDividends(dividendsResponse);
    } catch (err) {
      setError('Gagal memuat data portofolio');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPercentage = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getReturnColor = (value: number): string => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const openDividendModal = (projectId: string, projectTitle: string) => {
    setDividendProject({ id: projectId, title: projectTitle });
    setShowDividendModal(true);
  };

  const closeDividendModal = () => {
    setShowDividendModal(false);
    setDividendProject(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPortfolioData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Investasi</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolio?.totalInvested || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Profit Sharing</p>
              <p className={`text-2xl font-bold ${getReturnColor(portfolio?.totalReturn || 0)}`}>
                {formatCurrency(portfolio?.totalReturn || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ROI</p>
              <p className={`text-2xl font-bold ${getReturnColor(portfolio?.roi || 0)}`}>
                {formatPercentage(portfolio?.roi || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Project Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portofolio per Proyek</h3>
        {(portfolio?.projectBreakdown && portfolio.projectBreakdown.length > 0) ? (
          <>
            {/* Controls: Search and Page Size */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari proyek..."
                className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600"
              />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Baris per halaman:</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setCurrentPage(1); }}
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-600"
                >
                  {[5,10,20,50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {(() => {
              const rows = portfolio.projectBreakdown || [];
              const filtered = rows.filter(r => 
                r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
              );
              const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
              const safePage = Math.min(currentPage, totalPages);
              const start = (safePage - 1) * pageSize;
              const paged = filtered.slice(start, start + pageSize);

              return (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyek</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Investasi</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profit Sharing</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paged.map((row) => (
                          <tr key={row.projectId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{row.projectTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(row.totalInvested)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(row.totalReturn)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getReturnColor(row.roi)}`}>
                              {formatPercentage(row.roi)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => openDividendModal(row.projectId, row.projectTitle)}
                                className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                        {paged.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">Tidak ada data</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 text-sm">
                    <div className="text-gray-600">
                      Menampilkan {filtered.length === 0 ? 0 : start + 1} - {Math.min(start + pageSize, filtered.length)} dari {filtered.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-600"
                        onClick={() => setCurrentPage(1)}
                        disabled={safePage === 1}
                      >«</button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-600"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={safePage === 1}
                      >Sebelumnya</button>
                      <span className="px-2 text-gray-600">Hal {safePage} / {totalPages}</span>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-600"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={safePage === totalPages}
                      >Berikutnya</button>
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50 text-gray-600"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={safePage === totalPages}
                      >»</button>
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        ) : (
          <div className="text-sm text-gray-500">Belum ada data portofolio per proyek.</div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Total Profit Sharing (semua waktu):
              <span className="ml-1 font-semibold text-green-600">
                {formatCurrency(portfolio?.totalDividendsReceived || 0)}
              </span>
            </span>
            <button
              onClick={() => setActiveTab('dividends')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat semua
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {[...investments.slice(0, 3), ...dividends.slice(0, 5)]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    'amount' in item ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {'amount' in item ? (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {'amount' in item ? 'Investasi' : 'Profit Sharing'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    'amount' in item ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {'amount' in item ? '-' : '+'}{formatCurrency('amount' in item ? item.amount : item.investorDividend)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderInvestments = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Investasi</h3>
      {investments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Investasi</h4>
          <p className="text-gray-600">Mulai investasi pada proyek yang tersedia</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Investasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {investments.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {investment.project?.title || 'Unknown Project'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Status: {investment.project?.status || 'Unknown'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(investment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(investment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderDividends = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Profit Sharing</h3>
      {dividends.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Profit Sharing</h4>
          <p className="text-gray-600">Profit Sharing akan muncul setelah proyek mulai memberikan hasil</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyek
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah Profit Sharing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dividends.map((dividend) => (
                <tr key={dividend.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {dividend.projectTitle || 'Unknown Project'}
                      </div>
                      <div className="text-sm text-gray-500">
                        Project ID: {dividend.projectId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(dividend.investorDividend)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(dividend.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(dividend.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Portofolio Investasi</h1>
          <div className="text-sm text-gray-600">
            {portfolio?.activeInvestments || 0} investasi aktif
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'investments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Investasi ({investments.length})
            </button>
            <button
              onClick={() => setActiveTab('dividends')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dividends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profit Sharing ({dividends.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'investments' && renderInvestments()}
      {activeTab === 'dividends' && renderDividends()}

      {showDividendModal && dividendProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={closeDividendModal}></div>
          <div className="relative bg-white rounded-lg shadow-2xl w-11/12 max-w-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Riwayat Profit Sharing</h3>
                <p className="text-sm text-gray-600">Proyek: {dividendProject.title}</p>
              </div>
              <button onClick={closeDividendModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dividends.filter(d => String(d.projectId) === String(dividendProject.id)).map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(d.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(d.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{formatCurrency(d.investorDividend)}</td>
                    </tr>
                  ))}
                  {dividends.filter(d => String(d.projectId) === String(dividendProject.id)).length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">Belum ada dividen untuk proyek ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button onClick={closeDividendModal} className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorPortfolio;