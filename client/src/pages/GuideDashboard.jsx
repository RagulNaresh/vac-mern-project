import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { experienceService, bookingService } from '../services/api';

const CATEGORIES = [
  'Culture & Heritage',
  'Food & Culinary',
  'Nature & Adventure',
  'Art & Craft',
  'Nightlife & Music',
  'Wellness & Yoga'
];

const GuideDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('experiences'); // 'experiences' | 'bookings'
  const [myExperiences, setMyExperiences] = useState([]);
  const [guideBookings, setGuideBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit Experience
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Culture & Heritage');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, bookRes] = await Promise.all([
        experienceService.getAll({ guide: user.id }),
        bookingService.getGuideBookings()
      ]);

      if (expRes.data.success) {
        setMyExperiences(expRes.data.experiences);
      }
      if (bookRes.data.success) {
        setGuideBookings(bookRes.data.bookings);
      }
    } catch (err) {
      showToast('Failed to load guide dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const openAddModal = () => {
    setEditingExp(null);
    setTitle('');
    setDescription('');
    setCategory('Culture & Heritage');
    setLocation('');
    setPrice('');
    setDuration('');
    setMaxGroupSize('');
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setTitle(exp.title);
    setDescription(exp.description);
    setCategory(exp.category);
    setLocation(exp.location);
    setPrice(exp.price);
    setDuration(exp.duration);
    setMaxGroupSize(exp.maxGroupSize);
    setImageFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !location || !price || !duration || !maxGroupSize) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('price', price);
      formData.append('duration', duration);
      formData.append('maxGroupSize', maxGroupSize);

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('images', imageFiles[i]);
        }
      }

      if (editingExp) {
        const res = await experienceService.update(editingExp._id, formData);
        if (res.data.success) {
          showToast('Experience updated successfully', 'success');
          setMyExperiences((prev) =>
            prev.map((item) => (item._id === editingExp._id ? res.data.experience : item))
          );
        }
      } else {
        const res = await experienceService.create(formData);
        if (res.data.success) {
          showToast('Experience published successfully!', 'success');
          setMyExperiences((prev) => [res.data.experience, ...prev]);
        }
      }
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save experience';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExperience = async (expId, expTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${expTitle}"? This will also remove any bookings made for this tour.`)) {
      return;
    }

    try {
      const res = await experienceService.delete(expId);
      if (res.data.success) {
        showToast('Experience deleted', 'info');
        setMyExperiences((prev) => prev.filter((item) => item._id !== expId));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete experience';
      showToast(msg, 'error');
    }
  };

  // Calculate guide stats
  const totalRevenue = guideBookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const activeBookingsCount = guideBookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="page-container container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="badge badge-warning">Guide Portal</span>
          <h1 className="page-title" style={{ marginTop: '0.25rem' }}>
            Guide Dashboard
          </h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Manage your tours and guest bookings.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary" id="btn-create-experience">
          + Create New Experience
        </button>
      </div>

      {/* Stats Ribbon */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div>
            <div className="stat-value">{myExperiences.length}</div>
            <div className="stat-label">My Experiences</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{activeBookingsCount}</div>
            <div className="stat-label">Active Bookings</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div>
            <div className="stat-value">${totalRevenue}</div>
            <div className="stat-label">Total Confirmed Value (Pay at Venue)</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'experiences' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('experiences')}
          id="tab-my-experiences"
        >
          My Experiences ({myExperiences.length})
        </button>

        <button
          className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: 'var(--radius-md) var(--radius-md) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('bookings')}
          id="tab-received-bookings"
        >
          Guest Bookings ({guideBookings.length})
        </button>
      </div>

      {/* Tab 1: Experiences */}
      {activeTab === 'experiences' && (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : myExperiences.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <div className="empty-title">No tours created yet</div>
              <p className="empty-desc">Share your local expertise with the world. Create your first guided experience.</p>
              <button onClick={openAddModal} className="btn btn-primary">
                Create Experience
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tour Details</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Price / Person</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myExperiences.map((exp) => (
                    <tr key={exp._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={exp.images?.[0] || '/uploads/rome-colosseum.svg'}
                            alt={exp.title}
                            style={{ width: '50px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--secondary)' }}>{exp.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              ⏱️ {exp.duration} • 👥 Max {exp.maxGroupSize}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-secondary">{exp.category}</span>
                      </td>
                      <td>{exp.location}</td>
                      <td style={{ fontWeight: '700' }}>${exp.price}</td>
                      <td>
                        ★ {exp.avgRating > 0 ? exp.avgRating.toFixed(1) : 'New'} ({exp.numReviews})
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditModal(exp)}
                            className="btn btn-outline btn-sm"
                            id={`btn-edit-${exp._id}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp._id, exp.title)}
                            className="btn btn-danger-outline btn-sm"
                            id={`btn-delete-${exp._id}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Guest Bookings */}
      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <div className="spinner"></div>
          ) : guideBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <div className="empty-title">No bookings received yet</div>
              <p className="empty-desc">Once tourists book your experiences, their reservations will appear here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Tour</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {guideBookings.map((b) => {
                    const bookingDate = new Date(b.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <tr key={b._id}>
                        <td>
                          <div style={{ fontWeight: '700' }}>{b.user?.name || 'Traveler'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                        </td>
                        <td>
                          <strong>{b.experience?.title || 'Tour'}</strong>
                        </td>
                        <td>{bookingDate}</td>
                        <td>{b.guests}</td>
                        <td style={{ fontWeight: '700', color: 'var(--secondary)' }}>
                          ${b.totalPrice}
                          <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '600' }}>
                            Pay at venue
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              b.status === 'confirmed' ? 'badge-success' : 'badge-danger'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingExp ? 'Edit Experience' : 'Create New Experience'}
              </h2>
              <button onClick={closeModal} className="modal-close-btn" aria-label="Close modal">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} id="experience-form">
              <div className="form-group">
                <label className="form-label" htmlFor="exp-title">Title *</label>
                <input
                  id="exp-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Secret Rooftop Walking Tour"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="exp-desc">Description *</label>
                <textarea
                  id="exp-desc"
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe the itinerary, what travelers will see, taste, and experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="exp-cat">Category *</label>
                  <select
                    id="exp-cat"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-location">Location (City, address) *</label>
                  <input
                    id="exp-location"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rome, Piazza Navona"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="exp-price">Price / Person ($) *</label>
                  <input
                    id="exp-price"
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-duration">Duration *</label>
                  <input
                    id="exp-duration"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="exp-group">Max Group Size *</label>
                  <input
                    id="exp-group"
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="8"
                    value={maxGroupSize}
                    onChange={(e) => setMaxGroupSize(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Local File Upload with Multer */}
              <div className="form-group">
                <label className="form-label" htmlFor="exp-images">
                  Upload Photos (Local storage via Multer)
                </label>
                <input
                  id="exp-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="form-input"
                  onChange={(e) => setImageFiles(e.target.files)}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Stored locally in server/uploads/ and served statically. Max 5MB per image.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeModal} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  id="btn-save-experience"
                >
                  {submitting ? 'Saving...' : editingExp ? 'Update Experience' : 'Publish Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
