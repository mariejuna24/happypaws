import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createBooking, updateBookingStatus } from "../services/api";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import "../style/Navbar.css";

const ADD_ONS_LIST = [
  { id: 1, name: "Anal Sac Gland Expression", price: 350 },
  { id: 2, name: "Ear Cleaning / Plucking",   price: 350 },
  { id: 3, name: "PAWdicure (Nail Clip & File)", price: 350 },
  { id: 4, name: "Teeth Cleaning",            price: 350 },
];

const STEP_LABELS = ["Add-ons", "Schedule", "Your Info"];

const EMPTY_PET = () => ({ id: Date.now() + Math.random(), petName: "", species: "" });

const getInitialInfos = (loggedUser) => {
  const stored = JSON.parse(localStorage.getItem("userInfos"));
  if (stored && stored.length > 0) return stored;
  return [{ id: 1, fullName: loggedUser.fullName || "", phone: loggedUser.phone || "", email: loggedUser.email || "" }];
};

const getInitialSelectedId = (infos) => {
  const lastUsed = localStorage.getItem("lastUsedInfoId");
  if (lastUsed) {
    const parsed = Number(lastUsed);
    if (infos.find((i) => i.id === parsed)) return parsed;
  }
  return infos[0]?.id || null;
};

export default function BookingForm() {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const serviceRef  = useRef(state?.service || state?.booking);
  const service     = serviceRef.current;
  const editing     = state?.editing || false;
  const loggedUser  = JSON.parse(localStorage.getItem("user")) || {};
  const today       = new Date().toISOString().split("T")[0];

  const [savedInfos,     setSavedInfos]     = useState(() => getInitialInfos(loggedUser));
  const [selectedInfoId, setSelectedInfoId] = useState(() => getInitialSelectedId(getInitialInfos(loggedUser)));
  const [editingInfoId,  setEditingInfoId]  = useState(null);
  const [step,           setStep]           = useState(1);
  const [scheduleError,  setScheduleError]  = useState("");
  const [infoError,      setInfoError]      = useState("");
  const [submitting,     setSubmitting]     = useState(false);

  const [formData, setFormData] = useState(() => {
    const infos   = getInitialInfos(loggedUser);
    const selId   = getInitialSelectedId(infos);
    const info    = infos.find((i) => i.id === selId) || infos[0] || {};
    const booking = state?.booking;
    return {
      fullName: booking?.fullName || info.fullName || "",
      phone:    booking?.phone    || info.phone    || "",
      email:    booking?.email    || info.email    || "",
      date:     booking?.date     || "",
      time:     booking?.time     || "",
      addOns:   booking?.addOns   || [],
    };
  });

  const [pets, setPets] = useState(() => {
    const booking = state?.booking;
    if (booking?.pets?.length > 0) return booking.pets;
    if (booking?.petName) return [{ id: 1, petName: booking.petName, species: booking.species || "" }];
    return [EMPTY_PET()];
  });

  const servicePrice = Number(service?.servicePrice || service?.price) || 0;
  const addOnsPrice  = formData.addOns.reduce((s, a) => s + (Number(a.price) || 0), 0);
  const totalPrice   = (servicePrice * pets.length) + addOnsPrice;

  if (!service) return <p className="bf-no-service">Service not found.</p>;

  const handlePetChange = (id, field, value) =>
    setPets(p => p.map(pet => pet.id === id ? { ...pet, [field]: value } : pet));

  const addPet = () => {
    if (pets.length >= 5) return;
    setPets(p => [...p, EMPTY_PET()]);
  };

  const removePet = (id) => {
    if (pets.length === 1) return;
    setPets(p => p.filter(pet => pet.id !== id));
  };

  const handleSelectInfo = (info) => {
    setSelectedInfoId(info.id);
    setEditingInfoId(null);
    setFormData((p) => ({ ...p, fullName: info.fullName, phone: info.phone, email: info.email }));
    localStorage.setItem("lastUsedInfoId", String(info.id));
  };

  const handleAddInfo = () => {
    const newId   = Date.now();
    const newInfo = { id: newId, fullName: "", phone: "", email: "" };
    const updated = [...savedInfos, newInfo];
    setSavedInfos(updated);
    localStorage.setItem("userInfos", JSON.stringify(updated));
    setSelectedInfoId(newId);
    setEditingInfoId(newId);
    setFormData((p) => ({ ...p, fullName: "", phone: "", email: "" }));
    localStorage.setItem("lastUsedInfoId", String(newId));
  };

  const handleDeleteInfo = (e, id) => {
    e.stopPropagation();
    if (savedInfos.length === 1) return;
    const updated = savedInfos.filter((i) => i.id !== id);
    setSavedInfos(updated);
    localStorage.setItem("userInfos", JSON.stringify(updated));
    if (selectedInfoId === id) {
      const fb = updated[0];
      setSelectedInfoId(fb.id);
      setFormData((p) => ({ ...p, fullName: fb.fullName, phone: fb.phone, email: fb.email }));
      localStorage.setItem("lastUsedInfoId", String(fb.id));
    }
    if (editingInfoId === id) setEditingInfoId(null);
  };

  const handleInfoCardChange = (id, field, value) => {
    const updated = savedInfos.map((i) => (i.id === id ? { ...i, [field]: value } : i));
    setSavedInfos(updated);
    localStorage.setItem("userInfos", JSON.stringify(updated));
    if (id === selectedInfoId) setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleSaveInfoCard = (id) => {
    setEditingInfoId(null);
    const info = savedInfos.find((i) => i.id === id);
    if (info && id === selectedInfoId)
      setFormData((p) => ({ ...p, fullName: info.fullName, phone: info.phone, email: info.email }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (["fullName", "phone", "email"].includes(name)) {
      const updated = savedInfos.map((i) => (i.id === selectedInfoId ? { ...i, [name]: value } : i));
      setSavedInfos(updated);
      localStorage.setItem("userInfos", JSON.stringify(updated));
    }
  };

  const toggleAddOn = (addOn) => {
    const exists = formData.addOns.find((a) => a.id === addOn.id);
    setFormData((p) => ({
      ...p,
      addOns: exists ? p.addOns.filter((a) => a.id !== addOn.id) : [...p.addOns, addOn],
    }));
  };

  const handleNext = () => {
    if (step === 2) {
      if (!formData.date || !formData.time) { setScheduleError("Please select both date and time."); return; }
      if (formData.date < today)             { setScheduleError("Date cannot be in the past."); return; }
      if (formData.time < "08:00" || formData.time > "18:00") { setScheduleError("Time must be between 08:00 and 18:00."); return; }
      setScheduleError("");
    }
    setStep((s) => s + 1);
  };

  const generateRefNumber = () => {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `BK-${ts}-${rnd}`;
  };

  const submitBooking = async () => {
    setScheduleError("");
    setInfoError("");

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() ||
        !formData.date || !formData.time) {
      setInfoError("Please fill in all required fields.");
      return;
    }
    if (pets.some(p => !p.petName.trim() || !p.species.trim())) {
      setInfoError("Please fill in the name and breed for every pet.");
      return;
    }
    if (!/^(09\d{9}|\+639\d{9})$/.test(formData.phone)) {
      setInfoError("Invalid Philippine mobile number (09XXXXXXXXX or +639XXXXXXXXX).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setInfoError("Invalid email address.");
      return;
    }
    if (formData.date < today)  { setScheduleError("Date cannot be in the past."); setStep(2); return; }
    if (formData.time < "08:00" || formData.time > "18:00") { setScheduleError("Time must be between 08:00 and 18:00."); setStep(2); return; }

    setSubmitting(true);
    try {
      const userId = loggedUser.uid; // ← Firebase uses uid not id

      // Check for duplicate booking on same date (Firestore version)
      if (!editing) {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", userId),
          where("date", "==", formData.date)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setScheduleError("You already have a booking on this date. Please choose another date.");
          setStep(2);
          setSubmitting(false);
          return;
        }
      }

      let finalRefNumber;
      const payload = {
        serviceId:    service.id,
        serviceTitle: service.serviceTitle || service.title,
        servicePrice,
        ...formData,
        petName:  pets[0].petName,
        species:  pets[0].species,
        pets,
        totalPrice,
        status: "Pending",
        userId,
      };

      if (editing && state.booking?.id) {
        // Update existing booking in Firestore
        finalRefNumber = state.booking.refNumber;
        const bookingRef = doc(db, "bookings", state.booking.id);
        await updateDoc(bookingRef, { ...payload, refNumber: finalRefNumber });
      } else {
        // Create new booking in Firestore
        finalRefNumber = generateRefNumber();
        await createBooking({ ...payload, refNumber: finalRefNumber });
      }

      localStorage.setItem("lastUsedInfoId", String(selectedInfoId));
      localStorage.setItem("userInfos", JSON.stringify(savedInfos));

      const petLines = pets
        .map(p => `<div class="swal-detail"><span>🐾 Pet</span><strong>${p.petName} (${p.species})</strong></div>`)
        .join("");

      await Swal.fire({
        title: editing ? "Booking Updated!" : "Booking Confirmed! 🐾",
        html: `
          <div class="swal-booking-body">
            <p class="swal-service">${service.serviceTitle || service.title}</p>
            <div class="swal-detail"><span>📅 Date</span><strong>${formData.date} at ${formData.time}</strong></div>
            ${petLines}
            <div class="swal-detail"><span>💰 Total</span><strong>₱${totalPrice.toFixed(2)}</strong></div>
            <div class="swal-ref">
              <span># Ref No.</span>
              <code>${finalRefNumber}</code>
            </div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "View My Bookings",
        confirmButtonColor: "#d97706",
        allowOutsideClick: false,
        customClass: {
          popup:   "swal-booking-popup",
          title:   "swal-booking-title",
          confirm: "swal-booking-confirm",
        },
      });

      navigate("/user/my-bookings", { replace: true, state: { newRefNumber: finalRefNumber } });
    } catch (err) {
      console.error(err);
      setInfoError("Error scheduling appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bf-page">
      <div className="bf-container">

        <button className="bf-back" onClick={() => navigate(-1)}>← Back</button>

        <div className="bf-card">

          {/* Step indicator */}
          <div className="bf-steps">
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={i}>
                <div className={`bf-step${step === i+1 ? " active" : ""}${step > i+1 ? " done" : ""}`}>
                  <div className="bf-step__circle">{step > i+1 ? "✓" : i+1}</div>
                  <span className="bf-step__label">{label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`bf-step__line${step > i+1 ? " done" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress bar */}
          <div className="bf-progress">
            <div className="bf-progress__fill" style={{ width: `${((step - 1) / (STEP_LABELS.length - 1)) * 100}%` }} />
          </div>

          {/* Header / price summary */}
          <div className="bf-header">
            <div className="bf-header__icon-wrap">🐾</div>
            <h3 className="bf-header__title">{service.serviceTitle || service.title}</h3>
            <div className="bf-price-summary">
              <div className="bf-price-row">
                <span>Base Price</span>
                <strong>
                  ₱{servicePrice.toFixed(2)}
                  {pets.length > 1 && ` × ${pets.length} pets`}
                </strong>
              </div>
              {addOnsPrice > 0 && (
                <div className="bf-price-row">
                  <span>Add-ons</span>
                  <strong>₱{addOnsPrice.toFixed(2)}</strong>
                </div>
              )}
              <div className="bf-price-total">
                <span>Total</span>
                <strong>₱{totalPrice.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* STEP 1 — Add-ons */}
          {step === 1 && (
            <div className="bf-section">
              <h5 className="bf-section__heading">🐾 Select Add-ons <span className="bf-section__optional">(optional)</span></h5>
              <div className="bf-addons">
                {ADD_ONS_LIST.map((addOn) => {
                  const selected = formData.addOns.some((a) => a.id === addOn.id);
                  return (
                    <button
                      key={addOn.id}
                      className={`bf-addon${selected ? " selected" : ""}`}
                      onClick={() => toggleAddOn(addOn)}
                    >
                      <span className="bf-addon__check">{selected ? "✓" : "+"}</span>
                      <span className="bf-addon__name">{addOn.name}</span>
                      <span className="bf-addon__price">₱{addOn.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Schedule */}
          {step === 2 && (
            <div className="bf-section">
              <h5 className="bf-section__heading">📅 Choose Date & Time</h5>
              <div className="bf-schedule">
                <div className="bf-field">
                  <label className="bf-label">Date</label>
                  <input className="bf-input" type="date" name="date" value={formData.date} onChange={handleChange} min={today} />
                </div>
                <div className="bf-field">
                  <label className="bf-label">Time</label>
                  <input className="bf-input" type="time" name="time" value={formData.time} onChange={handleChange} min="08:00" max="18:00" />
                </div>
              </div>

              {scheduleError && <div className="bf-error-popup">⚠️ {scheduleError}</div>}

              <div className="bf-schedule-note">
                <span className="bf-schedule-note__icon">⏰</span>
                <div>
                  <strong>Working Hours: 8:00 AM – 6:00 PM only</strong>
                  <p>Appointments outside working hours will be automatically cancelled by the admin.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Your Info */}
          {step === 3 && (
            <div className="bf-section">
              <h5 className="bf-section__heading">👤 Your Details</h5>

              <div className="bf-saved-info-container">
                {savedInfos.map((info) => (
                  <div
                    key={info.id}
                    className={`bf-saved-info${selectedInfoId === info.id ? " selected" : ""}`}
                    onClick={() => editingInfoId !== info.id && handleSelectInfo(info)}
                  >
                    {editingInfoId === info.id ? (
                      <div className="bf-saved-info__edit" onClick={(e) => e.stopPropagation()}>
                        <input className="bf-input bf-input--sm" placeholder="Full Name" value={info.fullName}
                          onChange={(e) => handleInfoCardChange(info.id, "fullName", e.target.value)} />
                        <input className="bf-input bf-input--sm" placeholder="09XXXXXXXXX" value={info.phone}
                          onChange={(e) => handleInfoCardChange(info.id, "phone", e.target.value)} />
                        <input className="bf-input bf-input--sm" placeholder="Email" value={info.email}
                          onChange={(e) => handleInfoCardChange(info.id, "email", e.target.value)} />
                        <div className="bf-saved-info__edit-actions">
                          <button className="bf-btn-save-info" onClick={() => handleSaveInfoCard(info.id)}>✓ Save</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bf-saved-info__display">
                        <div className="bf-saved-info__text">
                          <p className="bf-saved-info__name">{info.fullName || <em>No name</em>}</p>
                          <p className="bf-saved-info__detail">{info.phone || <em>No phone</em>}</p>
                          <p className="bf-saved-info__detail">{info.email || <em>No email</em>}</p>
                        </div>
                        <div className="bf-saved-info__actions">
                          <button className="bf-btn-edit-info" title="Edit" onClick={(e) => { e.stopPropagation(); handleSelectInfo(info); setEditingInfoId(info.id); }}>✏️</button>
                          {savedInfos.length > 1 && (
                            <button className="bf-btn-delete-info" title="Delete" onClick={(e) => handleDeleteInfo(e, info.id)}>🗑️</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button className="bf-add-new-info" onClick={handleAddInfo}>+ Add New</button>
              </div>

              <div className="bf-fields">
                <div className="bf-field">
                  <label className="bf-label">Full Name</label>
                  <input className="bf-input" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="bf-field">
                  <label className="bf-label">Phone</label>
                  <input className="bf-input" placeholder="09XXXXXXXXX" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="bf-field">
                  <label className="bf-label">Email</label>
                  <input className="bf-input" type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="bf-pets-header">
                <h5 className="bf-section__heading bf-section__heading--pet">
                  🐶 Pet Information
                  <span className="bf-pets-count">
                    &nbsp;({pets.length} pet{pets.length > 1 ? "s" : ""})
                  </span>
                </h5>
                {pets.length < 5 && (
                  <button className="bf-btn-add-pet" onClick={addPet}>+ Add Another Pet</button>
                )}
              </div>

              {pets.map((pet, idx) => (
                <div key={pet.id} className="bf-pet-card">
                  <div className="bf-pet-card__header">
                    <span className="bf-pet-card__label">🐾 Pet {idx + 1}</span>
                    {pets.length > 1 && (
                      <button className="bf-pet-card__remove" onClick={() => removePet(pet.id)}>✕ Remove</button>
                    )}
                  </div>
                  <div className="bf-fields">
                    <div className="bf-field">
                      <label className="bf-label">Pet Name</label>
                      <input className="bf-input" placeholder="e.g. Buddy" value={pet.petName}
                        onChange={(e) => handlePetChange(pet.id, "petName", e.target.value)} />
                    </div>
                    <div className="bf-field">
                      <label className="bf-label">Species / Breed</label>
                      <input className="bf-input" placeholder="e.g. Shih Tzu" value={pet.species}
                        onChange={(e) => handlePetChange(pet.id, "species", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}

              {infoError && <div className="bf-error-popup">⚠️ {infoError}</div>}
            </div>
          )}

          {/* Navigation */}
          <div className="bf-nav">
            {step > 1 && (
              <button className="bf-btn-prev" onClick={() => { setScheduleError(""); setInfoError(""); setStep((s) => s - 1); }}>
                ← Previous
              </button>
            )}
            {step < 3 && (
              <button className="bf-btn-next" onClick={handleNext}>Next →</button>
            )}
            {step === 3 && (
              <button className="bf-btn-submit" onClick={submitBooking} disabled={submitting}>
                {submitting ? "Submitting…" : editing ? "Update Booking 🐾" : "Confirm & Schedule 🐾"}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}