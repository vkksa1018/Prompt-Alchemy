// SweetAlert2 wrapper with native fallbacks
export const alertHelper = {
  success(title, text = "") {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({ icon: "success", title, text });
    } else {
      console.log(`[Success Alert] ${title}: ${text}`);
      alert(`${title}\n${text}`);
    }
  },
  error(title, text = "") {
    if (typeof window !== "undefined" && window.Swal) {
      window.Swal.fire({ icon: "error", title, text });
    } else {
      console.error(`[Error Alert] ${title}: ${text}`);
      alert(`Error: ${title}\n${text}`);
    }
  },
  confirm(title, text = "") {
    if (typeof window !== "undefined" && window.Swal) {
      return window.Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then(result => result.isConfirmed);
    } else {
      return Promise.resolve(confirm(`${title}\n${text}`));
    }
  }
};
