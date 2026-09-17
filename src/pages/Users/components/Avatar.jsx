import React from 'react';

export default function Avatar({ user = {}, size = 40, ring = true, presence = true }) {
  const name = user?.name || user?.firstName || "?";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const ringClass = user?.accountType === "BI-RIVE" 
    ? "r-birive" 
    : user?.tenant === "orange" 
      ? "r-client" 
      : "r-agence";

  const hasPhoto = Boolean(user?.photo || user?.photoURL);
  const photoSrc = user?.photo || user?.photoURL;

  return (
    <div 
      className={`iam-avatar-ring ${ring ? ringClass : ""}`}
      style={{
        borderRadius: "50%",
        width: size + 5,
        height: size + 5,
        position: "relative",
        flexShrink: 0
      }}
    >
      <div 
        style={{
          borderRadius: "50%",
          overflow: "hidden",
          width: "100%",
          height: "100%",
          border: "2px solid #0D1233",
          background: "#161C4E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {hasPhoto ? (
          <img 
            src={photoSrc} 
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
            onError={(e) => {
              // fallback to initials on broken image
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div class="iam-avatar" style="width:${size}px;height:${size}px;font-size:${size * 0.34}px;display:flex;align-items:center;justify-content:center;">${initials}</div>`;
            }}
          />
        ) : (
          <div 
            className="iam-avatar"
            style={{
              width: size,
              height: size,
              fontSize: size * 0.34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#E8ECFF"
            }}
          >
            {initials}
          </div>
        )}
      </div>

      {presence && user?.presence && (
        <span 
          className={`iam-avatar-presence ${user.presence}`}
          style={{
            width: Math.max(8, size * 0.26),
            height: Math.max(8, size * 0.26)
          }} 
        />
      )}
    </div>
  );
}
