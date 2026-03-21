import React, { useEffect, useState } from "react";
import { getServices, addService, updateService, deleteService } from "../services/api"; // ← Firebase
import Swal from "sweetalert2";

const EMPTY_SERVICE = {
  title: "",
  desc: "",
  price: "",
  image: "",
  fullDescription: "",
};

const AdminServices = () => {
  const [services,   setServices]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY_SERVICE);
  const [submitting, setSubmitting] = useState(false);
  const [imgError,   setImgError]   = useState({});

  const fetchServices = async () => {
    try {
      const data = await getServices(); // ← Firebase
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openView  = (service) => setViewTarget(service);
  const closeView = () => setViewTarget(null);

  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_SERVICE);
    setShowModal(true);
  };

  const openEdit = (service) => {
    setViewTarget(null);
    setEditTarget(service);
    setForm({
      title:           service.title           || "",
      desc:            service.desc            || "",
      price:           service.price           || "",
      image:           service.image           || "",
      fullDescription: service.fullDescription || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTarget(null);
    setForm(EMPTY_SERVICE);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price:              Number(form.price),
        hygieneIncludes:    editTarget?.hygieneIncludes    || [],
        notes:              editTarget?.notes              || [],
        cancellationPolicy: editTarget?.cancellationPolicy || "",
      };

      if (editTarget) {
        await updateService(editTarget.id, { ...editTarget, ...payload }); // ← Firebase
      } else {
        await addService(payload); // ← Firebase
      }

      await Swal.fire({
        icon: "success",
        title: editTarget ? "Service Updated!" : "Service Added!",
        text: `"${form.title}" has been ${editTarget ? "updated" : "added"} successfully.`,
        confirmButtonColor: "#d97706",
        timer: 2000,
        showConfirmButton: false,
      });

      closeModal();
      fetchServices();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Oops!", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      html: `<p>Are you sure you want to delete <strong>${service.title}</strong>? This cannot be undone.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor:  "#6b7280",
      confirmButtonText:  "Yes, Delete",
      cancelButtonText:   "Cancel",
    });
    if (!result.isConfirmed) return;
    await deleteService(service.id); // ← Firebase
    setViewTarget(null);
    fetchServices();
  };

  return (
    <div className="as-page">

      <div className="as-header">
        <div className="as-header__left">
          <span className="as-header__icon">✂️</span>
          <div>
            <h3 className="as-header__title">Services</h3>
            <p className="as-header__sub">{services.length} service{services.length !== 1 ? "s" : ""} available</p>
          </div>
        </div>
        <button className="as-btn-add" onClick={openAdd}>+ Add Service</button>
      </div>

      {loading ? (
        <div className="as-loading">
          <div className="as-spinner" />
          <p>Loading services…</p>
        </div>
      ) : services.length === 0 ? (
        <div className="as-empty">
          <span className="as-empty__icon">🐾</span>
          <p>No services yet. Add your first one!</p>
        </div>
      ) : (
        <div className="as-grid">
          {services.map(service => (
            <div key={service.id} className="as-card">
              <div className="as-card__img-wrap">
                <img
                  src={imgError[service.id] ? "https://placehold.co/400x220?text=No+Image" : service.image}
                  alt={service.title}
                  className="as-card__img"
                  onError={() => setImgError(p => ({ ...p, [service.id]: true }))}
                />
                <span className="as-card__price-badge">₱{Number(service.price).toLocaleString()}</span>
              </div>
              <div className="as-card__body">
                <h5 className="as-card__title">{service.title}</h5>
                <p className="as-card__desc">{service.desc}</p>
              </div>
              <div className="as-card__footer">
                <button className="as-btn-view"   onClick={() => openView(service)}>👁 View</button>
                <button className="as-btn-edit"   onClick={() => openEdit(service)}>✏️ Edit</button>
                <button className="as-btn-delete" onClick={() => handleDelete(service)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewTarget && (
        <div className="as-modal-overlay" onClick={closeView}>
          <div className="as-modal as-modal--view" onClick={e => e.stopPropagation()}>
            <div className="as-view__hero">
              <img
                src={viewTarget.image || "https://placehold.co/600x260?text=No+Image"}
                alt={viewTarget.title}
                className="as-view__hero-img"
                onError={e => { e.target.src = "https://placehold.co/600x260?text=No+Image"; }}
              />
              <button className="as-modal__close as-modal__close--hero" onClick={closeView}>✕</button>
              <div className="as-view__hero-price">₱{Number(viewTarget.price).toLocaleString()}</div>
            </div>
            <div className="as-view__body">
              <h3 className="as-view__title">{viewTarget.title}</h3>
              <p className="as-view__short-desc">{viewTarget.desc}</p>
              <div className="as-view__divider" />
              {viewTarget.fullDescription && (
                <div className="as-view__section">
                  <p className="as-view__section-label">📋 Full Description</p>
                  <p className="as-view__section-text">{viewTarget.fullDescription}</p>
                </div>
              )}
              {viewTarget.hygieneIncludes?.length > 0 && (
                <div className="as-view__section">
                  <p className="as-view__section-label">🛁 What's Included</p>
                  <ul className="as-view__list">
                    {viewTarget.hygieneIncludes.map((item, i) => (
                      <li key={i} className="as-view__list-item">✓ {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewTarget.notes?.length > 0 && (
                <div className="as-view__section">
                  <p className="as-view__section-label">📝 Notes</p>
                  <ul className="as-view__list as-view__list--notes">
                    {viewTarget.notes.map((note, i) => (
                      <li key={i} className="as-view__list-item">• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewTarget.cancellationPolicy && (
                <div className="as-view__section">
                  <p className="as-view__section-label">⚠️ Cancellation Policy</p>
                  <p className="as-view__section-text as-view__section-text--policy">{viewTarget.cancellationPolicy}</p>
                </div>
              )}
              <div className="as-view__actions">
                <button className="as-btn-cancel-modal" onClick={closeView}>Close</button>
                <button className="as-btn-edit as-btn-edit--lg" onClick={() => openEdit(viewTarget)}>✏️ Edit Service</button>
                <button className="as-btn-delete as-btn-delete--lg" onClick={() => handleDelete(viewTarget)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="as-modal-overlay" onClick={closeModal}>
          <div className="as-modal" onClick={e => e.stopPropagation()}>
            <div className="as-modal__header">
              <h4 className="as-modal__title">
                {editTarget ? "✏️ Edit Service" : "➕ Add New Service"}
              </h4>
              <button className="as-modal__close" onClick={closeModal}>✕</button>
            </div>
            <form className="as-modal__body" onSubmit={handleSubmit}>
              <div className="as-field">
                <label className="as-label">Service Title <span className="as-required">*</span></label>
                <input className="as-input" type="text" name="title"
                  placeholder="e.g. Full Grooming Package"
                  value={form.title} onChange={handleChange} required />
              </div>
              <div className="as-field">
                <label className="as-label">Short Description <span className="as-required">*</span></label>
                <input className="as-input" type="text" name="desc"
                  placeholder="Brief one-liner shown on the service card"
                  value={form.desc} onChange={handleChange} required />
              </div>
              <div className="as-field">
                <label className="as-label">Price (₱) <span className="as-required">*</span></label>
                <input className="as-input" type="number" name="price"
                  placeholder="e.g. 850" min="0"
                  value={form.price} onChange={handleChange} required />
              </div>
              <div className="as-field">
                <label className="as-label">Image URL <span className="as-required">*</span></label>
                <input className="as-input" type="text" name="image"
                  placeholder="https://…"
                  value={form.image} onChange={handleChange} required />
                {form.image && (
                  <img src={form.image} alt="preview" className="as-img-preview"
                    onError={e => { e.target.style.display = "none"; }}
                    onLoad={e  => { e.target.style.display = "block"; }} />
                )}
              </div>
              <div className="as-field">
                <label className="as-label">Full Description <span className="as-required">*</span></label>
                <textarea className="as-input as-textarea" name="fullDescription"
                  placeholder="Detailed description shown on the service detail page"
                  rows={4} value={form.fullDescription} onChange={handleChange} required />
              </div>
              <div className="as-modal__actions">
                <button type="button" className="as-btn-cancel-modal" onClick={closeModal}>Cancel</button>
                <button type="submit" className="as-btn-submit" disabled={submitting}>
                  {submitting ? "Saving…" : editTarget ? "Save Changes" : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminServices;