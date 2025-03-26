import { useState } from "react";

const Settings = () => {
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");
  const [assetIdPrefix, setAssetIdPrefix] = useState("AST");
  const [autoGenerateIds, setAutoGenerateIds] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newAssetNotifications, setNewAssetNotifications] = useState(true);
  const [maintenanceNotifications, setMaintenanceNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = () => {
    alert("Settings Saved Successfully!");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <label className="block mb-2">Company Name</label>
        <input className="border p-2 w-full mb-4" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

        <label className="block mb-2">Admin Email</label>
        <input type="email" className="border p-2 w-full mb-4" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />

        <label className="block mb-2">Asset ID Prefix</label>
        <input className="border p-2 w-full mb-4" value={assetIdPrefix} onChange={(e) => setAssetIdPrefix(e.target.value)} />

        <div className="flex items-center mb-4">
          <label className="mr-4">Auto-generate Asset IDs</label>
          <input type="checkbox" checked={autoGenerateIds} onChange={() => setAutoGenerateIds(!autoGenerateIds)} />
        </div>

        <button onClick={handleSaveSettings} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="flex items-center mb-4">
          <label className="mr-4">Email Notifications</label>
          <input type="checkbox" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
        </div>

        <div className="flex items-center mb-4">
          <label className="mr-4">New Asset Notifications</label>
          <input type="checkbox" checked={newAssetNotifications} onChange={() => setNewAssetNotifications(!newAssetNotifications)} />
        </div>

        <div className="flex items-center mb-4">
          <label className="mr-4">Maintenance Notifications</label>
          <input type="checkbox" checked={maintenanceNotifications} onChange={() => setMaintenanceNotifications(!maintenanceNotifications)} />
        </div>

        <button onClick={handleSaveSettings} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
        <div className="flex items-center mb-4">
          <label className="mr-4">Compact View</label>
          <input type="checkbox" checked={compactView} onChange={() => setCompactView(!compactView)} />
        </div>

        <button onClick={handleSaveSettings} className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <label className="block mb-2">Current Password</label>
        <input type="password" className="border p-2 w-full mb-4" />

        <label className="block mb-2">New Password</label>
        <input type="password" className="border p-2 w-full mb-4" />

        <label className="block mb-2">Confirm New Password</label>
        <input type="password" className="border p-2 w-full mb-4" />

        <div className="flex items-center mb-4">
          <label className="mr-4">Two-Factor Authentication</label>
          <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
        </div>

        <button onClick={handleSaveSettings} className="bg-blue-500 text-white px-4 py-2 rounded">Update Password</button>
      </div>
    </div>
  );
};

export default Settings;
