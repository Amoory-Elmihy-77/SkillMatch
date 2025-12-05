import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";
import {
  Users,
  Filter,
  X,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { getUserAvatarUrl } from "../../utils/avatar";

const ManagerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);
  // const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const response = await api.get(`/manager/applications${params}`);
      const apps = response.data.data?.applications || [];
      setApplications(apps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, status, notes = "") => {
    setUpdating(true);
    try {
      await api.patch(`/applications/${applicationId}/status`, {
        status,
        notes,
      });
      toast.success(`Application ${status}`);
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      console.error("Failed to update application:", error);
      toast.error("Failed to update application status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: <Clock className="w-5 h-5" />,
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        };
      case "reviewed":
        return {
          label: "Reviewed",
          icon: <FileText className="w-5 h-5" />,
          className: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "accepted":
        return {
          label: "Accepted",
          icon: <CheckCircle className="w-5 h-5" />,
          className: "bg-green-50 text-green-700 border-green-200",
        };
      case "rejected":
        return {
          label: "Rejected",
          icon: <XCircle className="w-5 h-5" />,
          className: "bg-red-50 text-red-700 border-red-200",
        };
      default:
        return {
          label: status,
          icon: <FileText className="w-5 h-5" />,
          className: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-2">
            Review and manage applications to your opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex gap-2">
            {["all", "pending", "reviewed", "accepted", "rejected"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === status
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <Loader />
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusConfig = getStatusConfig(app.status);
              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <img
                        src={getUserAvatarUrl(app.applicant)}
                        alt={app.applicant?.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {app.applicant?.name}
                          </h3>
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm ${statusConfig.className}`}
                          >
                            {statusConfig.icon}
                            <span className="font-medium">
                              {statusConfig.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {app.applicant?.email}
                        </p>
                        <Link
                          to={`/opportunities/${app.opportunity?._id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {app.opportunity?.title}
                        </Link>
                        <div className="mt-3 text-sm text-gray-500">
                          Applied:{" "}
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                        {app.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Your Notes:
                            </p>
                            <p className="text-sm text-gray-600">{app.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      Review
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-500">
              {filter !== "all"
                ? `No ${filter} applications`
                : "No applications yet"}
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                Review Application
              </h2>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4">
                <img
                  src={getUserAvatarUrl(selectedApp.applicant)}
                  alt={selectedApp.applicant?.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApp.applicant?.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedApp.applicant?.email}
                  </p>
                </div>
              </div>

              {/* Opportunity */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Applied for:
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedApp.opportunity?.title}
                </p>
              </div>

              {/* Application Date */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Application Date:
                </p>
                <p className="text-gray-900">
                  {new Date(selectedApp.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Add notes about this application..."
                  defaultValue={selectedApp.notes || ""}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const notes = document.getElementById("notes").value;
                    handleUpdateStatus(selectedApp._id, "accepted", notes);
                  }}
                  disabled={updating || selectedApp.status === "accepted"}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept
                </button>
                <button
                  onClick={() => {
                    const notes = document.getElementById("notes").value;
                    handleUpdateStatus(selectedApp._id, "reviewed", notes);
                  }}
                  disabled={updating || selectedApp.status === "reviewed"}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5" />
                  Mark Reviewed
                </button>
                <button
                  onClick={() => {
                    const notes = document.getElementById("notes").value;
                    handleUpdateStatus(selectedApp._id, "rejected", notes);
                  }}
                  disabled={updating || selectedApp.status === "rejected"}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerApplications;
