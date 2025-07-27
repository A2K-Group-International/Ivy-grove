import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { QrCode } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { Student } from "@/types/attendance";
import { useState } from "react";

interface QRScannerProps {
  students: Student[] | undefined;
  onCheckIn: (studentId: string) => void;
  onCheckOut: (studentId: string) => void;
}

type ScanState = "scanning" | "valid" | "invalid";

const QRScanner = ({ students, onCheckIn, onCheckOut }: QRScannerProps) => {
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [scanState, setScanState] = useState<ScanState>("scanning");

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes.length) return;

    const result = detectedCodes[0]?.rawValue;

    const validStudent = students?.find(
      (student) => student.student_id === result
    );

    if (validStudent) {
      setFoundStudent(validStudent);
      setScanState("valid");
    } else {
      setFoundStudent(null);
      setScanState("invalid");
    }
  };

  const handleScanAgain = () => {
    setFoundStudent(null);
    setScanState("scanning");
  };

  const handleAttendanceAction = () => {
    if (!foundStudent) return;

    const hasCheckedIn = foundStudent.attendance.some(
      (att) => att.time_in !== null
    );
    const hasCheckedOut = foundStudent.attendance.some(
      (att) => att.time_out !== null
    );

    if (!hasCheckedIn) {
      onCheckIn(foundStudent.id);
    } else if (hasCheckedIn && !hasCheckedOut) {
      onCheckOut(foundStudent.id);
    }

    handleScanAgain();
  };

  const getActionButtonText = () => {
    if (!foundStudent) return "Close";

    const hasCheckedIn = foundStudent.attendance.some(
      (att) => att.time_in !== null
    );
    const hasCheckedOut = foundStudent.attendance.some(
      (att) => att.time_out !== null
    );

    if (!hasCheckedIn) {
      return "Check In";
    } else if (hasCheckedIn && !hasCheckedOut) {
      return "Check Out";
    }
    return "Already Complete";
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <QrCode />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Digital ID Scanner</DialogTitle>
          <DialogDescription>
            {scanState === "scanning" &&
              "Scan the QR Code to identify the student."}
            {scanState === "invalid" && "Invalid QR Code"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {scanState === "scanning" && (
            <div className="flex justify-center">
              <Scanner sound={false} onScan={handleScan} />
            </div>
          )}

          {scanState === "valid" && foundStudent && (
            <div className="space-y-3">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  Student Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {foundStudent.students.first_name}{" "}
                    {foundStudent.students.last_name}
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  Parent Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {`Name: ${foundStudent.students.parent_id?.first_name} ${foundStudent.students.parent_id?.last_name}`}
                  </p>
                  <p className="font-medium">
                    {`Address: ${foundStudent.students.parent_id?.address}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {scanState === "invalid" && (
            <div className="text-center space-y-3">
              <div className="text-red-500 font-medium">QR Code is invalid</div>
              <p className="text-sm text-gray-600">
                The scanned QR code does not match any student in this class.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {scanState === "valid" && (
            <Button variant="outline" onClick={handleScanAgain}>
              Scan Another
            </Button>
          )}
          {scanState === "invalid" && (
            <Button onClick={handleScanAgain}>Scan Again</Button>
          )}
          {scanState === "valid" ? (
            <Button onClick={handleAttendanceAction}>
              {getActionButtonText()}
            </Button>
          ) : (
            <DialogTrigger asChild>
              <Button variant="outline">Close</Button>
            </DialogTrigger>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
