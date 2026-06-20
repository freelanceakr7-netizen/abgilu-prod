import React, { useState, useEffect } from 'react';
import { Search, Shield, UserCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUsersPaginated } from '../../firebase/services/userService';

const UsersManagement = ({ 
  searchTerm, 
  setSearchTerm, 
  onUserRoleUpdate, 
  onDeleteUser, 
  onToggleUserStatus,
  updatingUserId,
  refreshUsers
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [firstVisibleDoc, setFirstVisibleDoc] = useState(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    pageSize: 10,
    hasMore: false,
    hasLess: false
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users with pagination
  const fetchUsers = async (direction = 'next') => {
    setLoading(true);
    try {
      const result = await getUsersPaginated({
        pageSize: pagination.pageSize,
        lastVisibleDoc: direction === 'next' ? lastVisibleDoc : null,
        firstVisibleDoc: direction === 'previous' ? firstVisibleDoc : null,
        searchTerm
      });

      setUsers(result.users);
      setLastVisibleDoc(result.pagination.lastVisibleDoc);
      setFirstVisibleDoc(result.pagination.firstVisibleDoc);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching paginated users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when search term changes
  useEffect(() => {
    setLastVisibleDoc(null);
    setFirstVisibleDoc(null);
    setCurrentPage(1);
    fetchUsers('next');
  }, [searchTerm]);

  // Refresh users when refreshUsers callback is triggered
  useEffect(() => {
    if (refreshUsers) {
      setLastVisibleDoc(null);
      setFirstVisibleDoc(null);
      setCurrentPage(1);
      fetchUsers('next');
    }
  }, [refreshUsers]);

  const handlePageChange = (direction) => {
    if (direction === 'next' && pagination.hasMore) {
      setCurrentPage(prev => prev + 1);
      fetchUsers('next');
    } else if (direction === 'previous' && pagination.hasLess) {
      setCurrentPage(prev => prev - 1);
      fetchUsers('previous');
    }
  };

  const handleRoleUpdate = (userId, isAdmin) => {
    if (window.confirm(`Are you sure you want to ${isAdmin ? 'remove admin from' : 'make admin for'} this user?`)) {
      onUserRoleUpdate(userId, isAdmin);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      onDeleteUser(userId);
    }
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  return (
    <div className="bg-kora border border-indigo/10 rounded-none shadow-md overflow-hidden">
      <div className="p-6 border-b border-indigo/10 bg-kora-light">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo/40" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-kora border border-indigo/20 rounded-none text-sm text-indigo focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#4C0E0E] text-white">
            <tr>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">User</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Email</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Phone</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Role</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Status</th>
              <th className="text-left py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Joined</th>
              <th className="text-right py-4 px-6 text-[10px] uppercase font-bold tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo/10">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-none h-10 w-10 border-b-2 border-indigo"></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7">
                  <div className="py-20 text-center">
                    <UserCheck size={48} className="mx-auto text-indigo/10 mb-6" />
                    <h3 className="text-xl font-serif text-indigo mb-2 font-medium">No users found</h3>
                    <p className="text-indigo/40 text-sm">
                      {searchTerm ? 'Try adjusting your search criteria' : 'No users registered yet'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={`user-${user.id || 'no-id'}-${index}`} className="hover:bg-kora-light transition-colors group">
                  <td className="py-4 px-6 text-indigo">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 shrink-0 border border-indigo/10 bg-indigo/5 rounded-none overflow-hidden p-0.5">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id || index}`}
                          alt={user.displayName}
                          className="w-full h-full object-cover rounded-none"
                        />
                      </div>
                      <span className="font-bold text-sm tracking-tight">{user.displayName || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo/60 text-sm">{user.email}</td>
                  <td className="py-4 px-6 text-indigo/60 text-sm">{user.phone || '--'}</td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider ${
                      user.isAdmin
                        ? 'bg-indigo text-kora shadow-sm'
                        : 'bg-indigo/5 text-indigo/60 border border-indigo/10'
                    }`}>
                      {user.isAdmin ? <Shield size={10} /> : <UserCheck size={10} />}
                      {user.isAdmin ? 'Admin' : 'User'}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-[10px] uppercase font-bold tracking-wider ${
                      user.isActive === false
                        ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                        : 'bg-green-500/10 text-green-700 border border-green-500/20'
                    }`}>
                      {user.isActive === false ? 'Suspended' : 'Active'}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-indigo/40 text-[10px] uppercase font-bold tracking-widest">{user.memberSince || 'N/A'}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => handleRoleUpdate(user.id, !user.isAdmin)}
                        disabled={updatingUserId === user.id}
                        className={`p-2 rounded-none border transition-colors ${
                          user.isAdmin
                            ? 'border-indigo/20 text-indigo hover:bg-indigo hover:text-kora'
                            : 'border-indigo/20 text-indigo hover:bg-indigo hover:text-kora'
                        } disabled:opacity-50`}
                        title={user.isAdmin ? 'Revoke Admin' : 'Grant Admin'}
                      >
                        {updatingUserId === user.id ? (
                          <div className="animate-spin rounded-none h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Shield size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => onToggleUserStatus(user.id, user.isActive !== false)}
                        className={`p-2 rounded-none border transition-colors ${
                          user.isActive === false
                            ? 'border-green-500/20 text-green-700 hover:bg-green-500 hover:text-white'
                            : 'border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white'
                        }`}
                        title={user.isActive === false ? 'Reactivate' : 'Suspend'}
                      >
                        <UserCheck size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 border border-terracotta/20 text-terracotta hover:bg-terracotta hover:text-white rounded-none transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
        <div className="bg-kora-light px-8 py-6 flex items-center justify-between border-t border-indigo/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange('previous')}
              disabled={!pagination.hasLess}
              className="flex items-center gap-2 px-6 py-2.5 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-kora disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <button
              onClick={() => handlePageChange('next')}
              disabled={!pagination.hasMore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-none border border-indigo/20 bg-kora text-indigo text-[10px] uppercase font-bold tracking-widest hover:bg-indigo hover:text-kora disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo/40">
                Page {currentPage} of {totalPages || 1}
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo/20">
                {pagination.totalCount} Total Entries
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {(() => {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages || 1, startPage + 4);
                if (endPage - startPage < 4 && startPage > 1) {
                  startPage = Math.max(1, endPage - 4);
                }
                
                const pageNumbers = [];
                for (let p = startPage; p <= endPage; p++) {
                  pageNumbers.push(p);
                }
                
                return pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => {
                      if (pageNum === currentPage) return;
                      if (pageNum > currentPage) handlePageChange('next');
                      else handlePageChange('previous');
                    }}
                    disabled={Math.abs(pageNum - currentPage) > 1}
                    className={`w-10 h-10 rounded-none text-[10px] font-bold transition-all border ${
                      currentPage === pageNum
                        ? 'bg-indigo text-kora border-indigo shadow-lg'
                        : 'bg-kora text-indigo/40 border-indigo/10 hover:border-indigo disabled:opacity-20'
                    }`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;


