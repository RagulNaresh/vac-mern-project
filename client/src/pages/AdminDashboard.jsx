import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService, experienceService } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'experiences'
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch users
      try {
        const usersRes = await adminService.getUsers();
        if (usersRes.data?.success && Array.isArray(usersRes.data?.users)) {
          setUsers(usersRes.data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        showToast(err.response?.data?.message || 'Failed to load user accounts', 'error');
      }

      // Fetch experiences
      try {
        const expRes = await experienceService.getAll({});
        if (expRes.data?.success && Array.isArray(expRes.data?.experiences)) {
          setExperiences(expRes.data.experiences);
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        showToast(err.response?.data?.message || 'Failed to load experiences', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    const currentUserId = user?.id || user?._id;
    if (userId === currentUserId) {
      showToast('You cannot delete your own admin account', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? All their created experiences and bookings will be removed.`)) {
      return;
    }

    try {
      const res = await adminService.deleteUser(userId);
      if (res.data.success) {
        showToast(res.data.message || 'User deleted successfully', 'info');
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        // Refresh experiences list in case this user was a guide
        const refreshedExp = await experienceService.getAll({});
        if (refreshedExp.data?.success) {
          setExperiences(refreshedExp.data.experiences);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user';
      showToast(msg, 'error');
    }
  };

  const handleDeleteExperience = async (expId, expTitle) => {
    if (!window.confirm(`Are you sure you want to delete experience "${expTitle}" as administrator?`)) {
      return;
    }

    try {
      const res = await experienceService.delete(expId);
      if (res.data.success) {
        showToast('Experience removed by administrator', 'info');
        setExperiences((prev) => prev.filter((e) => (e._id || e.id) !== expId));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove experience';
      showToast(msg, 'error');
    }
  };

  const currentUserId = user?.id || user?._id;
  const touristCount = users.filter((u) => u.role === 'tourist').length;
  const guideCount = users.filter((u) => u.role === 'guide').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="page-container container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-danger">Administrator Console</span>
          <h1 className="page-title" style={{ marginTop: '0.25rem' }}>
            Platform Management
          </h1>
          <p className="page-subtitle">
            Supervise user registrations, guide privileges, and catalog moderation.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="btn btn-outline btn-sm"
          id="btn-admin-refresh"
          title="Reload latest records"
        >
          🔄 Refresh Records
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            👥
          </div>
          <div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-label">Total Users ({touristCount} Tourists, {guideCount} Guides)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div>
            <div className="stat-value">{experiences.length}</div>
            <div className="stat-label">Total Experiences Catalog</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-light)', color: '#92400E' }}>
            🛡️
          </div>
          <div>
            <div className="stat-value">{adminCount}</div>
            <div className="stat-label">System Admins</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('users')}
          id="admin-tab-users"
        >
          User Accounts ({users.length})
        </button>

        <button
          className={`btn ${activeTab === 'experiences' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('experiences')}
          id="admin-tab-experiences"
        >
          All Experiences ({experiences.length})
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : activeTab === 'users' ? (
        /* Tab 1: Users Management */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const uId = u._id || u.id;
                const isCurrentUser = uId === currentUserId;
                const joinedDate = new Date(u.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr key={uId}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{u.name}</div>
                      {isCurrentUser && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                          (You)
                        </span>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'badge-danger'
                            : u.role === 'guide'
                            ? 'badge-warning'
                            : 'badge-primary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>{joinedDate}</td>
                    <td>
                      {!isCurrentUser ? (
                        <button
                          onClick={() => handleDeleteUser(uId, u.name)}
                          className="btn btn-danger-outline btn-sm"
                          id={`admin-delete-user-${uId}`}
                        >
                          Delete User
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Active Session</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 2: Experiences Moderation */
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tour Title</th>
                <th>Guide</th>
                <th>Category</th>
                <th>Location</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => {
                const expId = exp._id || exp.id;
                return (
                  <tr key={expId}>
                    <td>
                      <strong>{exp.title}</strong>
                    </td>
                    <td>{exp.guide?.name || 'Unknown'}</td>
                    <td>
                      <span className="badge badge-secondary">{exp.category}</span>
                    </td>
                    <td>{exp.location}</td>
                    <td style={{ fontWeight: '700' }}>${exp.price}</td>
                    <td>
                      ★ {exp.avgRating > 0 ? exp.avgRating.toFixed(1) : 'New'} ({exp.numReviews})
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteExperience(expId, exp.title)}
                        className="btn btn-danger-outline btn-sm"
                        id={`admin-delete-exp-${expId}`}
                      >
                        Delete Tour
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
