import { Patient, Assessment } from "@/types";
import { BEHAVIOURS } from "@/lib/behaviours";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Aarav Sharma",
    dateOfBirth: "2019-04-12",
    caregiverName: "Priya Sharma",
    caregiverContact: "9876543210",
    createdAt: "2026-06-01",
  },
  {
    id: "p2",
    name: "Meera Iyer",
    dateOfBirth: "2020-01-22",
    caregiverName: "Suresh Iyer",
    caregiverContact: "9876501234",
    createdAt: "2026-06-10",
  },
  {
    id: "p3",
    name: "Kabir Nair",
    dateOfBirth: "2018-09-05",
    caregiverName: "Anjali Nair",
    caregiverContact: "9876512345",
    createdAt: "2026-07-02",
  },
];

export const mockAssessments: Assessment[] = [
  {
    id: "a1",
    patientId: "p1",
    assessmentDate: "2026-07-15",
    status: "approved",
    scores: BEHAVIOURS.map((b, i) => ({
      behaviour: b,
      result: i % 3 === 0 ? "absent" : "present",
      notes: "",
    })),
  },
];