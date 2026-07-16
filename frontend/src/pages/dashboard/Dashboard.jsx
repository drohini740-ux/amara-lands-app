import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../redux/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row g-4">

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Total Properties</h6>
              <h2>{data?.totalProperties || 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Pending</h6>
              <h2>{data?.pendingProperties || 0}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Approved</h6>
              <h2>{data?.approvedProperties || 0}</h2>
            </div>
          </div>
        </div>

      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-header">
          <h5 className="mb-0">Recent Properties</h5>
        </div>

        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data?.recentProperties?.length > 0 ? (
                data.recentProperties.map((property) => (
                  <tr key={property.id}>
                    <td>{property.property_name}</td>
                    <td>{property.city}</td>
                    <td>{property.state}</td>
                    <td>{property.verification_status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}