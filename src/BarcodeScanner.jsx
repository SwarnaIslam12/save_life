import React, { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "bootstrap/dist/css/bootstrap.min.css";

function NIDForm() {
  const [scannedData, setScannedData] = useState("");
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    nidNumber: "",
    dob: "",
    bloodGroup: "",
  });
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const html5QrCode = new Html5Qrcode("reader");
      html5QrCode
        .scanFile(file, true)
        .then((result) => {
          setScannedData(result);
          const extractedInfo = extractNIDDetails(result);
          setUserInfo({ ...userInfo, ...extractedInfo });
        })
        .catch((err) => {
          setError(
            "An error occurred while scanning. Please upload a scanned image of the back of the NID."
          );
        });
    }
  };

  const extractNIDDetails = (text) => {
    const namePattern = /NM([^]+)/;
    const nidPattern = /NW(\d+)/;
    const dobPattern = /BR(\d{4})(\d{2})(\d{2})/;

    const nameMatch = text.match(namePattern);
    const nidMatch = text.match(nidPattern);
    const dobMatch = text.match(dobPattern);

    const name = nameMatch ? nameMatch[1].trim() : "Name not found";
    const nidNumber = nidMatch ? nidMatch[1] : "NID number not found";
    const dob = dobMatch
      ? `${dobMatch[3]}-${dobMatch[2]}-${dobMatch[1]}`
      : "DOB not found";

    return { name, nidNumber, dob };
  };

  const handleBloodGroupChange = (event) => {
    setUserInfo({ ...userInfo, bloodGroup: event.target.value });
  };

  const handleCheckboxChange = () => {
    setIsConfirmed(!isConfirmed);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isConfirmed) {
      console.log("User Info:", userInfo);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">NID and Blood Group Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="nidImage">
            Upload a scanned image of the back of the NID.
          </label>
          <input
            type="file"
            className="form-control"
            id="nidImage"
            accept="image/*"
            onChange={handleFileUpload}
          />
          <div id="reader" style={{ display: "none" }}></div>
        </div>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.name}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>NID Number</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.nidNumber}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>Date of Birth</label>
          <input
            type="text"
            className="form-control"
            value={userInfo.dob}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="bloodGroup">Blood Group</label>
          <select
            className="form-control"
            id="bloodGroup"
            value={userInfo.bloodGroup}
            onChange={handleBloodGroupChange}
            required
          >
            <option value="" disabled>
              Select your blood group
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="confirmCheck"
            checked={isConfirmed}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="confirmCheck">
            I confirm that the above information is correct
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isConfirmed}
        >
          Submit
        </button>
      </form>
      {error && (
        <div className="alert alert-danger mt-3">
          <strong>Error:</strong> {error}
        </div>
      )}
      {scannedData && (
        <div className="alert alert-info mt-3">
          <strong>Scanned Data:</strong> {scannedData}
        </div>
      )}
    </div>
  );
}

export default NIDForm;
