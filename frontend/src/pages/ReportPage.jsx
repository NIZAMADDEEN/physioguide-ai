import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { getReports, exportPdf } from "../services/reportService";
import { formatDate } from "../utils/helpers";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";
import StatusChip from "../components/common/StatusChip";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import DataTable from "../components/common/DataTable";
import ReportCard from "../components/ReportCard";

export default function ReportPage() {
  const { data: reports, loading } = useApi(getReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  const handleExport = async (id, e) => {
    e?.stopPropagation(); // Prevent row click
    setExportingId(id);
    try {
      const blobUrl = await exportPdf(id);
      // Mock download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `report-${id}.pdf`;
      a.click();
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setExportingId(null);
    }
  };

  const columns = [
    { key: "date", label: "Date", render: (r) => formatDate(r.date) },
    {
      key: "title",
      label: "Report Title",
      render: (r) => <span className="font-bold">{r.title}</span>,
    },
    { key: "therapist", label: "Therapist" },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusChip status={r.status} />,
    },
    {
      key: "actions",
      label: "",
      render: (r) => (
        <div className="text-end">
          <Button
            variant="secondary"
            size="sm"
            icon="download"
            onClick={(e) => handleExport(r.id, e)}
            loading={exportingId === r.id}
          >
            PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-primary-color text-on-primary p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden">
        <div
          className="position-absolute rounded-circle bg-white opacity-10"
          style={{
            width: "300px",
            height: "300px",
            right: "-10%",
            top: "-50%",
          }}
        />
        <div className="position-relative z-1">
          <h1 className="text-headline-lg m-0 mb-2">Clinical Reports</h1>
          <p className="text-body-md m-0 opacity-75 max-w-lg">
            Review detailed assessments, milestone evaluations, and notes shared
            by your physical therapist.
          </p>
        </div>
        <div className="position-relative z-1">
          <Button variant="white" icon="filter_list">
            Filter Reports
          </Button>
        </div>
      </div>

      <Card padding="0" className="overflow-hidden">
        {loading ? (
          <div className="p-5 text-center">
            <Loader />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={reports}
            onRowClick={(row) => setSelectedReport(row)}
          />
        )}
      </Card>

      {/* Report Detail Modal */}
      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="Report Details"
        size="lg"
      >
        <ReportCard
          report={selectedReport}
          onExport={() => handleExport(selectedReport?.id)}
          isExporting={exportingId === selectedReport?.id}
          onClose={() => setSelectedReport(null)}
        />
      </Modal>
    </div>
  );
}
