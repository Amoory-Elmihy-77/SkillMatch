import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import { Briefcase, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import toast from "react-hot-toast";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const response = await api.get("/applications/my-applications");
      const apps = response.data.data?.applications || [];
      setApplications(apps);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load your applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Review",
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              My Applications
            </h1>
          </div>
          <p className="text-gray-600">
            Track the status of your job applications
          </p>
        </div>

        {/* Applications List */}
        {loading ? (
          <Loader />
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              return (
                <div
                  key={application._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        to={`/opportunities/${application.opportunity?._id}`}
                        className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {application.opportunity?.title || "Opportunity"}
                      </Link>
                      <p className="text-gray-600 mt-1">
                        {application.opportunity?.company || "Company"}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>
                          Applied:{" "}
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                        {application.updatedAt !== application.createdAt && (
                          <span>
                            Updated:{" "}
                            {new Date(
                              application.updatedAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {application.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Notes from Reviewer:
                          </p>
                          <p className="text-sm text-gray-600">
                            {application.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig.className}`}
                    >
                      {statusConfig.icon}
                      <span className="font-medium">{statusConfig.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start applying to opportunities to see them here
            </p>
            <Link
              to="/opportunities"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Opportunities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
