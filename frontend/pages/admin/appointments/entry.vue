<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";
import { usePatient } from "~/composables/usePatient";
import { useClinic } from "~~/composables/useClinic";
import { useCommon } from "~~/composables/useCommon";
import { useAppointment } from "~/composables/useAppointment";
import { useInvitation } from "~/composables/useInvitation";
import { useSurvey } from "~/composables/useSurvey";
import { format, differenceInYears } from "date-fns";
import { useToast } from "vue-toastification";
import { Form } from "vee-validate";

import {
  TableHeader,
  FileHeaderType,
  OldPriorityType,
  OldSpecializationType,
  AppointmentCodeType,
  Appointment,
  AppointmentDetail,
  Tooth,
  Diagnosis,
  Treatment,
  DoctorDetail,
  PatientType,
} from "~/types/appointment";

definePageMeta({
  layout: "admin",
});

const config = useRuntimeConfig();
const toast = useToast();
const editableAppointmentId = ref();
const route = useRoute();
const router = useRouter();

const { getUserProfile, isDoctor } = useAuth();
const { getApprovedStatus, fetchSpecialties, getSpecialties } = useCommon();
const { fetchPatientInvitations } = useInvitation();
const { fetchSurvey, getSurveys } = useSurvey();
const {
  fetchAppointmentCodes,
  fetchSingleAppointment,
  fetchAppointmentDuration,
  fetchTooths,
  fetchDiagnostics,
  fetchTreatments,
  fetchPriorities,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createAppointmentDetails,
  updateAppointmentDetails,
  deleteAppointmentDetails,
  createTooth,
  createDiagnostic,
  createTreatment,
  createAppointmentDuration,
  createAppointmentPriority,
  createAppointmentSpecialization,
  updateAppointmentPriority,
  updateAppointmentSpecialization,
  createAppointmentFile,
  createAppointmentSurvey,
  updateAppointmentSurvey,
  deleteAppointmentSurvey,
  createAppointmentShortCode,
  deleteAppointmentShortCode,
  getAppointmentCodes,
  getTypeOfAppointments,
  getPatientDiseases,
  getTooths,
  getDiagnostics,
  getTreatments,
  getDurations,
} = useAppointment();
const { getMyApprovedPatients } = usePatient();
const { fetchActiveCompanyForUser } = useClinic();

const authUser = computed<any>(() => getUserProfile.value);
const specialties = computed(() => getSpecialties.value);
const appointmentCodes = computed(() => getAppointmentCodes.value);
const typeOfAppointments = computed(() => getTypeOfAppointments.value);
const approvedStatus = computed(() => getApprovedStatus.value);
const tooths = computed(() => getTooths.value);
const diagnostics = computed(() => getDiagnostics.value);
const treatments = computed(() => getTreatments.value);
const chosenTimes = computed(() => getDurations.value);
const patients = computed(() => getMyApprovedPatients.value);
const surveys = computed(() => getSurveys.value);
const getSelectedDuration = computed(() => {
  return selectedDuration.value?.text;
});

fetchSpecialties({
  langId: authUser.value?.lang?.id,
});
fetchAppointmentCodes();
fetchSurvey({
  doctorId: authUser.value?.id,
});

const search = ref("");
const headers = ref<TableHeader[]>([
  { text: "Tooth", value: "tooth" },
  { text: "Diagnostic", value: "diagnosis" },
  { text: "Treatment", value: "treatment" },
]);
const appointmentFileHeaders = ref<FileHeaderType[]>([
  { text: "Name", value: "name" },
  { text: "Date", value: "date" },
  {
    text: "Actions",
    value: "action",
    sortable: false,
    align: "center",
    width: 265,
  },
]);
const appointmentFiles = ref<any[]>([]);
const selectedFiles = ref<any[]>([]);
const finalSelectableAllFiles = ref<any[]>([]);
const appointments: any = ref<Appointment[] | AppointmentDetail[]>([]);
const appointment = reactive<Appointment | AppointmentDetail>({
  id: 0,
  tooth: {},
  diagnosis: "",
  treatment: "",
});
const discard = ref(false);
const diagnosisSearch = ref("");
const treatmentSearch = ref("");
const selectedDateTime = ref("");
const selectedPatient: any = ref(null);
const doctorDetails = ref<DoctorDetail>({
  id: "",
  name: "",
});
const activeCompany = ref<any>();
const existingCreatedAppointmentSurvey = ref<any>();
const selectedSurvey = ref(null);
const selectedDateTimeWithFormat = computed(() => {
  let selectedTime = new Date(selectedDateTime.value).toLocaleDateString();
  return selectedTime;
});

const dentalClinicSpecialitie = ref(null);
const appointmentCode = ref<string[]>([]);
const appointmentShortCodes = ref<string[]>([]);
const getChipColor: any = (item: any) => {
  switch (true) {
    case item.startsWith("P"):
      return "red";
    case item.startsWith("D"):
      return "green";
    case item.startsWith("T"):
      return "info";
    case item.startsWith("M"):
      return "pink";
    default:
      return "";
  }
};
const removeAppointmentCode = async (item: any) => {
  const index = appointmentCode.value.findIndex((id: string) => item.id === id);
  appointmentCode.value.splice(index, 1);  
};

const oldDentalClinicSpecialitie = ref<OldSpecializationType>({
  appointmentSpecializationId: "",
  id: "",
  name: "",
});
const typeOfAppointment = ref(null);
const oldTypeOfAppointment = ref<OldPriorityType>({
  appointmentPriorityId: "",
  id: "",
  name: "",
});
const confirmation = ref();
const note = ref("");
const tabItems = ref([{ tab: "Treatment" }]);
const editableIndex = ref(-1);
const selectedDuration = ref();
const timeSearch = ref("");
const under12 = ref(true);
const setTableActionColumnForDoctor = () => {
  if (isDoctor.value) {
    headers.value.push({
      text: "Actions",
      value: "action",
      sortable: false,
      align: "center",
      width: 265,
    });
    tabItems.value.push({ tab: "Diseases" });
    tabItems.value.push({ tab: "Notes" });
    tabItems.value.push({ tab: "Files" });
  } else {
    tabItems.value.push({ tab: "Files" });
  }
};

setTableActionColumnForDoctor();
fetchAppointmentDuration();
fetchTooths();
fetchDiagnostics({
  langId: authUser.value?.lang?.id,
});
fetchTreatments({
  langId: authUser.value?.lang?.id,
});
fetchPriorities({
  langId: authUser.value?.lang?.id,
});

watch(selectedDateTime, (newDate: string) => {
  if (!newDate) {
    defineEditableMode();
  }
});

const addMore = ref(false);

const createNewEditableAppointmentDetails = async (
  appointmentData: AppointmentDetail
) => {
  const toothId = appointmentData.tooth ? appointmentData.tooth.id : "";
  const diagnosticId = appointmentData.diagnosis
    ? appointmentData.diagnosis.id
    : "";
  const treatmentId = appointmentData.treatment
    ? appointmentData.treatment.id
    : "";
  const { data }: any = await createAppointmentDetails({
    appointmentId: editableAppointmentId.value,
    toothId,
    diagnosticId,
    treatmentId,
    createdBy: authUser.value?.id,
    updatedBy: authUser.value?.id,
  });

  appointments.value.push({
    id: data.createAppointmentDetails.appointmentDetails.id,
    tooth: data.createAppointmentDetails.appointmentDetails.tooth,
    diagnosis: data.createAppointmentDetails.appointmentDetails.diagnosis,
    treatment: data.createAppointmentDetails.appointmentDetails.treatment,
  });
};
const saveAppointmentDetails = async () => {
  let tooth: Tooth = {};
  if (typeof appointment.tooth === "object") {
    tooth = appointment.tooth;
  }
  let diagnosis: Diagnosis = {};
  if (typeof appointment.diagnosis === "object") {
    diagnosis = appointment.diagnosis;
  }
  let treatment: Treatment = {};
  if (typeof appointment.treatment === "object") {
    treatment = appointment.treatment;
  }
  const appointmentData: AppointmentDetail = {
    id: appointment.id,
    tooth,
    diagnosis,
    treatment,
  };
  if (!appointmentData.id && editableAppointmentId.value) {
    createNewEditableAppointmentDetails(appointmentData);
  } else {
    if (editableIndex.value > -1) {
      appointments.value.splice(editableIndex.value, 1, appointmentData);
      editableIndex.value = -1;
    } else {
      appointments.value.push(appointmentData);
    }
  }
  reset();
};

const editAppointmentDetails = (item: any, index: number) => {
  editableIndex.value = index;
  appointment.id = item.id ? Number(item.id) : 0;
  appointment.tooth = item.tooth;
  appointment.diagnosis = item.diagnosis;
  appointment.treatment = item.treatment;
};
const remove = async (item: any, index: number) => {
  if (item.id) {
    await deleteAppointmentDetails({ id: parseInt(item.id) });
    toast.success("Appointment Details Successfully Deleted!");
  }
  appointments.value.splice(index, 1);
};
const add = () => {
  addMore.value = true;
};
const cancel = () => {
  addMore.value = false;
};
const reset = () => {
  appointment.id = 0;
  appointment.tooth = {};
  appointment.diagnosis = "";
  appointment.treatment = "";
};

const checkAppointmentCodes = () => {
  let getAppointmentProblemCodes = [];
  let getAppointmentDecisionsCodes = [];
  let getAppointmentTreatmentCodes = [];
  let getAppointmentMaterialCodes = [];

  for (const id of appointmentCode.value) {
    const getCode = appointmentCodes.value.find((item: AppointmentCodeType) => {
      return parseInt(item.id) === parseInt(id);
    });
    if (getCode && getCode.codeType === "P") {
      getAppointmentProblemCodes.push(getCode);
    } else if (getCode && getCode.codeType === "D") {
      getAppointmentDecisionsCodes.push(getCode);
    } else if (getCode && getCode.codeType === "T") {
      getAppointmentTreatmentCodes.push(getCode);
    } else if (getCode && getCode.codeType === "M") {
      getAppointmentMaterialCodes.push(getCode);
    }
  }

  if (
    getAppointmentProblemCodes.length !== getAppointmentDecisionsCodes.length ||
    getAppointmentDecisionsCodes.length !==
      getAppointmentTreatmentCodes.length ||
    getAppointmentTreatmentCodes.length !== getAppointmentMaterialCodes.length
  ) {
    return false;
  } else {
    return true;
  }
};

const saveAllAppointment = async () => {
  if (!checkAppointmentCodes()) {
    toast.error("Please select your valid appointment code");
    return;
  }

  const startDate = new Date(selectedDateTime.value).toISOString();
  const duration = selectedDuration.value.number;
  const patientId = parseInt(selectedPatient.value);
  const noteText = note.value;
  const doctorId = authUser.value?.id;
  const createdBy = authUser.value?.id;
  const updatedBy = authUser.value?.id;
  const specialitieId = Number(dentalClinicSpecialitie.value);
  const typeOfAppointmentId = Number(typeOfAppointment.value);
  const companyId = Number(activeCompany.value.id);
  const selectedSurveyId = Number(selectedSurvey.value);

  if (editableAppointmentId.value) {
    await updateAppointmentAndDetails(
      companyId,
      patientId,
      doctorId,
      startDate,
      duration,
      noteText,
      specialitieId,
      typeOfAppointmentId,
      selectedSurveyId,
      createdBy,
      updatedBy
    );

    toast.success("Appointment Successfully Updated");
  } else {
    await storeAppointmentAndDetails(
      companyId,
      patientId,
      doctorId,
      startDate,
      duration,
      noteText,
      specialitieId,
      typeOfAppointmentId,
      selectedSurveyId,
      createdBy,
      updatedBy
    );

    toast.success("Appointment Successfully Created");
  }
  discard.value = false;
  router.push("/admin/appointments");
};

const storeAppointmentAndDetails = async (
  companyId: number,
  patientId: number,
  doctorId: number,
  startDate: string,
  duration: number,
  noteText: string,
  specialitieId: number,
  typeOfAppointmentId: number,
  selectedSurveyId: number,
  createdBy: number,
  updatedBy: number
) => {
  const { data }: any = await createAppointment({
    companyId,
    patientId,
    doctorId,
    startDate,
    duration,
    note: noteText,
    createdBy,
    updatedBy,
  });
  const appointmentId = data.createAppointment?.appointment.id;
  appointmentCode.value.forEach(async (code: string) => {
    const codeId = Number(code);
    await createAppointmentShortCode({
      appointmentId,
      codeId,
      createdBy,
      updatedBy,
    });
  });

  await createAppointmentPriority({
    appointmentId,
    priorityId: typeOfAppointmentId,
    createdById: createdBy,
    updatedById: updatedBy,
  });

  await createAppointmentSpecialization({
    appointmentId,
    specializationId: specialitieId,
    createdById: createdBy,
    updatedById: updatedBy,
  });

  appointments.value.forEach(async (item: Appointment | AppointmentDetail) => {
    let toothId: string | number | undefined = 0;
    if (typeof item?.tooth === "object") {
      toothId = item.tooth?.id;
    }
    let diagnosticId: string | number | undefined = 0;
    if (typeof item?.diagnosis === "object") {
      diagnosticId = item.diagnosis?.id;
    }
    let treatmentId: string | number | undefined = 0;
    if (typeof item?.treatment === "object") {
      treatmentId = item.treatment?.id;
    }
    await createAppointmentDetails({
      appointmentId,
      toothId,
      diagnosticId,
      treatmentId,
      createdBy,
      updatedBy,
    });
  });
  if (selectedSurveyId) {
    await createAppointmentSurvey({
      surveyId: selectedSurveyId,
      appointmentId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  }

  finalSelectableAllFiles.value.forEach(async (file: any) => {
    await createAppointmentFile({
      name: file.name,
      file,
      appointmentId: appointmentId,
      doctorId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  });
};

const updateAppointmentAndDetails = async (
  companyId: number,
  patientId: number,
  doctorId: number,
  startDate: string,
  duration: number,
  noteText: string,
  specialitieId: number,
  typeOfAppointmentId: number,
  selectedSurveyId: number,
  createdBy: number,
  updatedBy: number
) => {
  await updateAppointment({
    id: editableAppointmentId.value,
    companyId: companyId,
    patientId: patientId,
    doctorId: doctorId,
    startDate: startDate,
    duration: duration,
    note: noteText,
    updatedBy: updatedBy,
  });

  const appointmentId: number = Number(editableAppointmentId.value);

  if (oldTypeOfAppointment.value.appointmentPriorityId) {
    await updateAppointmentPriority({
      id: Number(oldTypeOfAppointment.value.appointmentPriorityId),
      appointmentId,
      priorityId: typeOfAppointmentId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  } else {
    await createAppointmentPriority({
      appointmentId,
      priorityId: typeOfAppointmentId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  }

  if (oldDentalClinicSpecialitie.value.appointmentSpecializationId) {
    await updateAppointmentSpecialization({
      id: Number(oldDentalClinicSpecialitie.value.appointmentSpecializationId),
      appointmentId,
      specializationId: specialitieId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  } else {
    await createAppointmentSpecialization({
      appointmentId,
      specializationId: specialitieId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  }

  const existingAppointmentCodes = appointmentShortCodes.value.map(
    (node: any) => node?.appointmentCode?.id
  );
  const deletableAppointmentCodes = existingAppointmentCodes.filter(
    (x: string) => !appointmentCode.value.includes(x)
  );
  const insertableAppointmentCodes = appointmentCode.value.filter(
    (x: string) => !existingAppointmentCodes.includes(x)
  );

  deletableAppointmentCodes.forEach(async (id: string) => {
    const shortCode: any = appointmentShortCodes.value.find(
      (node: any) => id === node?.appointmentCode?.id
    );
    if (shortCode) {
      await deleteAppointmentShortCode(shortCode.id);
    }
  });
  insertableAppointmentCodes.forEach(async (id: string) => {
    await createAppointmentShortCode({
      appointmentId,
      codeId: Number(id),
      createdBy,
      updatedBy,
    });
  });
  appointments.value.forEach(async (item: Appointment | AppointmentDetail) => {
    const id = item?.id;
    let toothId: string | number | undefined = 0;
    if (typeof item?.tooth === "object") {
      toothId = item.tooth?.id;
    }
    let diagnosticId: string | number | undefined = 0;
    if (typeof item?.diagnosis === "object") {
      diagnosticId = item.diagnosis?.id;
    }
    let treatmentId: string | number | undefined = 0;
    if (typeof item?.treatment === "object") {
      treatmentId = item.treatment?.id;
    }
    await updateAppointmentDetails({
      id,
      appointmentId,
      toothId,
      diagnosticId,
      treatmentId,
      updatedBy,
    });
  });

  if (existingCreatedAppointmentSurvey.value?.id && selectedSurveyId) {
    await updateAppointmentSurvey({
      appointmentSurveyId: Number(existingCreatedAppointmentSurvey.value.id),
      surveyId: selectedSurveyId,
      appointmentId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  } else if (
    existingCreatedAppointmentSurvey.value?.id &&
    selectedSurveyId == 0
  ) {
    await deleteAppointmentSurvey({
      appointmentSurveyId: existingCreatedAppointmentSurvey.value?.id,
    });
  } else if (selectedSurveyId) {
    await createAppointmentSurvey({
      surveyId: selectedSurveyId,
      appointmentId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  }

  finalSelectableAllFiles.value.forEach(async (file: any) => {
    await createAppointmentFile({
      name: file.name,
      file,
      appointmentId,
      doctorId,
      createdById: createdBy,
      updatedById: updatedBy,
    });
  });
};

const discardAppointment = () => {
  router.push("/admin/appointments");
};
const deleteAppointmentEvent = async () => {
  confirmation.value
    .open("Delete", "Are you want to delete?", { color: "red" })
    .then(async (res: boolean) => {
      if (res) {
        await deleteAppointment({ id: parseInt(editableAppointmentId.value) });
        toast.success("Appointment Successfully Deleted!");
        router.push("/admin/appointments");
      }
      return false;
    });
};

const defineEditableMode = () => {
  if (editableAppointmentId.value) {
    discard.value = true;
  }
};

const appendNewDuration = async (appendData: any) => {
  const data = appendData?.target.value;
  if (typeof data === "string") {
    let duration = 0;
    const regex = new RegExp("([0-9]+)|([a-zA-Z]+)", "g");
    const times = data.match(regex) || [];
    if (times.length > 2) {
      alert("Please provide valid string");
      selectedDuration.value = "";
    } else {
      const number = times[0];
      const flag = times[1];
      if (flag === "m") {
        duration = Number(number);
      } else if (flag === "h") {
        duration = Number(number) * 60;
      } else {
        alert("Please provide valid string");
        selectedDuration.value = "";
      }
    }
    const res = await createAppointmentDuration({
      number: duration,
      createdBy: parseInt(authUser.value?.id),
    });
    if (res) {
      selectedDuration.value = res;
    }
  }
};
const calculatePatientDateOfBirth = (patientId: number) => {
  let patientData: any;

  if (isDoctor.value) {
    patientData = patients.value.find((item: PatientType) => {
      return Number(item.userId) === Number(patientId);
    });
  } else {
    patientData = authUser.value;
  }

  if (patientData?.dateOfBirth) {
    const dateOfBirth = new Date(patientData.dateOfBirth);
    const currentDate = new Date();
    const year = differenceInYears(currentDate, dateOfBirth);
    if (year > 12) {
      under12.value = false;
    } else {
      under12.value = true;
    }
  } else {
    toast.error("This user's date of birth has not been updated!");
  }
};
const appendNewDiagnostic = async (appendData: any) => {
  const data = appendData?.target.value;
  if (typeof data === "string") {
    const res = await createDiagnostic({
      name: data,
      createdBy: parseInt(authUser.value?.id),
    });
    if (res) {
      appointment.diagnosis = res;
    }
  }
};
const appendNewTreatment = async (appendData: any) => {
  // defineEditableMode();
  const data = appendData?.target.value;

  if (typeof data === "string") {
    const res = await createTreatment({
      name: data,
      createdBy: parseInt(authUser.value?.id),
    });
    if (res) {
      appointment.treatment = res;
    }
  }
};

const prepareEditableData = async () => {
  const { data }: any = await fetchSingleAppointment({
    id: parseInt(editableAppointmentId.value),
    langId: authUser.value?.lang?.id,
  });

  const appointment = data?.value?.appointments?.edges[0].node;
  activeCompany.value = appointment.company;

  const duration = appointment.duration;
  const selectedOldDuration = chosenTimes.value.find((item: any) => {
    return item.number === duration;
  });
  const specialization = appointment.appointmentspecializationSet.edges;
  const priority = appointment.appointmentprioritySet.edges;
  const appointmentCodeRes = appointment.appointmentshortcodeSet.edges;

  selectedPatient.value = appointment.patient.id;
  selectedDateTime.value = appointment.startDate;
  selectedDuration.value = selectedOldDuration;

  if (specialization && specialization.length > 0) {
    dentalClinicSpecialitie.value = specialization[0].node.specialization.id;
    oldDentalClinicSpecialitie.value = {
      appointmentSpecializationId: specialization[0].node.id,
      id: specialization[0].node.specialization.id,
      name: specialization[0].node.specialization.name,
    };
  }

  if (priority && priority.length > 0) {
    typeOfAppointment.value = priority[0].node.priority.id;
    oldTypeOfAppointment.value = {
      appointmentPriorityId: priority[0].node.id,
      id: priority[0].node.priority.id,
      name: priority[0].node.priority.name,
    };
  }

  if (appointmentCodeRes && appointmentCodeRes.length > 0) {
    appointmentCodeRes.forEach((item: any) => {
      appointmentShortCodes.value.push(item?.node);
      appointmentCode.value.push(item?.node?.appointmentCode?.id);
    });
  }

  let appointmentsData: Appointment[] = [];
  appointment.appointmentDetails?.edges.forEach((item: any) => {
    appointmentsData.push({
      id: item.node.id,
      tooth: item.node.tooth ? item.node.tooth : { id: 0, number: "" },
      diagnosis: item.node.diagnosis
        ? item.node.diagnosis
        : { id: 0, name: "" },
      treatment: item.node.treatment
        ? item.node.treatment
        : { id: 0, name: "" },
    });
  });

  let newNote = appointment.note;
  if (
    appointment.appointmentlangSet &&
    appointment.appointmentlangSet.edges?.length > 0
  ) {
    newNote = appointment.appointmentlangSet.edges[0]?.node?.note;
  }

  appointments.value = appointmentsData;
  note.value = newNote;
  doctorDetails.value = appointment.doctor;

  let files: any[] = [];
  appointment.appointmentfileSet?.edges.forEach((item: any) => {
    files.push({
      id: item.node.id,
      file: item.node.file,
      name: item.node.name,
      createdAt: item.node.createdAt,
    });
  });

  appointmentFiles.value = files;

  if (selectedPatient.value) {
    calculatePatientDateOfBirth(Number(selectedPatient.value));
  }

  if (appointment.appointmentSurvey.edges.length > 0) {
    existingCreatedAppointmentSurvey.value =
      appointment.appointmentSurvey.edges[0].node;
    selectedSurvey.value =
      appointment.appointmentSurvey.edges[0].node.survey.id;
  }
};

const getActiveCompany = async () => {
  const userCompany: any = await fetchActiveCompanyForUser({
    userId: Number(authUser.value?.id),
    groupName: "Doctor",
    statusId: Number(approvedStatus.value?.id),
    isActive: true,
  });

  if (userCompany && userCompany.edges && userCompany.edges.length > 0) {
    activeCompany.value = userCompany.edges[0].node.company;
  }
};

onMounted(async () => {
  if (appointments.value.length === 0) {
    addMore.value = true;
  }
  // start edit appointments
  editableAppointmentId.value = route.query.editableId;

  if (isDoctor.value) {
    await getActiveCompany();

    await fetchPatientInvitations({
      companyId: Number(activeCompany.value?.id),
      groupName: "Patient",
      doctorId: Number(authUser.value?.id),
      userId: null,
      statusId: null,
      from: "myPatients",
    });
  }

  if (editableAppointmentId.value) {
    await prepareEditableData();
  }
  // end edit appointments
});

const selectedTeethNumber = async (teethNumber: number) => {
  let newTooths = null;

  const findIndex = tooths.value.findIndex((item: Tooth) => {
    return item.number === teethNumber;
  });

  if (findIndex > -1) {
    newTooths = tooths.value[findIndex];
  } else {
    const res = await createTooth({
      number: teethNumber,
      createdBy: parseInt(authUser.value?.id),
    });
    newTooths = res;
  }
  if (newTooths) {
    appointment.tooth = newTooths;
  }
};

const saveSelectedFiles = async () => {
  selectedFiles.value.forEach((item: any) => {
    const nowDate = format(new Date(), "dd/MM/yy HH:mm:ss");
    const date = nowDate.split(" ").join("T");
    appointmentFiles.value.push({
      id: null,
      file: null,
      name: item.name,
      createdAt: date,
    });
  });
  finalSelectableAllFiles.value = finalSelectableAllFiles.value.concat(
    selectedFiles.value
  );
  selectedFiles.value = [];
};

const downloadFile = (item: any) => {
  const fullPath = `${config.public?.apiClient}/media/${item.file}`;
  const name = item.name.split(".")[0] ?? new Date().getTime().toString();
  fetch(fullPath)
    .then((response) => response.blob())
    .then((imageBlob) => {
      const imageObjectURL = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = imageObjectURL;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
};
const tab = ref("");
const tableHeader = ref([
  { id: 1, text: "Tooth" },
  { id: 1, text: "Diagnostic" },
  { id: 1, text: "Treatment" },
  { id: 1, text: "Actions" },
]);
const patientTableHeader = ref([
  { id: 1, text: "Tooth" },
  { id: 1, text: "Diagnostic" },
  { id: 1, text: "Treatment" },
]);
const tableData = ref([
  { tooth: 12, diagnostic: "Hypodontia", treatment: "Oral Prophylaxis" },
]);
</script>

<template>
  <ClientOnly>
    <Form as="v-form" @submit="saveAllAppointment">
      <BaseActionButtons
        v-if="isDoctor"
        resetButton="d-none"
        @discardButtonFunction="discardAppointment"
        @deleteButtonFunction="deleteAppointmentEvent"
      ></BaseActionButtons>
      <v-btn v-else color="green" @click="$router.back()"> Back </v-btn>
      <v-row class="mb-8">
        <v-col v-if="isDoctor" cols="3">
          <v-autocomplete
            v-model="selectedPatient"
            :items="patients"
            item-value="userId"
            item-title="name"
            class="mt-4"
            :label="$t('singleAppointment.Patient')"
            hide-details
            @update:model-value="calculatePatientDateOfBirth"
          ></v-autocomplete>
          <Datepicker class="mt-4" v-model="selectedDateTime" :placeholder="$t('singleAppointment.startDate')"/>
          <v-autocomplete
            clearable
            class="mt-4"
            :label="$t('singleAppointment.typeOfAppointment')"
            item-value="id"
            item-title="name"
            v-model="typeOfAppointment"
            :items="typeOfAppointments"
            hide-details
          ></v-autocomplete>
          <v-autocomplete
            clearable
            class="mt-4"
            label="Survey"
            hide-details
            v-if="authUser.accessSurvey"
            v-model="selectedSurvey"
            :items="surveys"
            item-value="id"
            item-title="name"
          ></v-autocomplete>
        </v-col>

        <v-col v-if="isDoctor" cols="3">
          <v-combobox
            clearable
            class="mt-4"
            :label="$t('singleAppointment.duration')"
            hide-details
            v-model="selectedDuration"
            :items="chosenTimes"
            :search-input.sync="timeSearch"
            @keyup.enter="appendNewDuration"
            item-value="id"
            item-title="text"
            attach
          ></v-combobox>
          <v-autocomplete
            clearable
            class="mt-4"
            :label="$t('singleAppointment.specialities')"
            hide-details
            v-model="dentalClinicSpecialitie"
            :items="specialties"
            item-value="id"
            item-title="name"
          ></v-autocomplete>
          <v-autocomplete
            v-model="appointmentCode"
            hint="Please select problem,decision,treatment and material"
            persistent-hint
            class="mt-4"
            hide-details
            multiple
            closable-chips
            :label="$t('singleAppointment.AppointmentCode')"
            :items="appointmentCodes"
            item-value="id"
            item-title="name"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                class="mb-1 mr-1"
                v-bind="props"
                variant="outlined"
                :text="item.title"
                :color="getChipColor(item.title)"
                @click="removeAppointmentCode(item)"
              >
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col v-if="!isDoctor">
          <v-table fixed-header hover class="mt-5">
            <tbody>
              <tr>
                <th>Doctor Name</th>
                <td>{{ doctorDetails.name }}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{{ selectedDateTimeWithFormat }}</td>
              </tr>
              <tr>
                <th>Duration</th>
                <td>{{ getSelectedDuration }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <v-col cols="6">
          <BaseUnder12Svg
            @selectedTeethNumber="selectedTeethNumber"
            v-if="under12"
          ></BaseUnder12Svg>
          <BaseOver12Svg
            v-else
            @selectedTeethNumber="selectedTeethNumber"
          ></BaseOver12Svg>
        </v-col>
      </v-row>

      <v-row v-if="isDoctor">
        <v-col>
          <v-card>
            <v-tabs v-model="tab" color="info" slider-color="info">
              <v-tab value="one">Treatment</v-tab>
              <v-tab value="two">Disease</v-tab>
              <v-tab value="three">Notes</v-tab>
              <v-tab value="Four">Files</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="tab" class="min-height">
                <v-window-item value="one">
                  <v-table fixed-header hover>
                    <thead>
                      <tr>
                        <th v-for="item in tableHeader" :key="item.id">
                          {{ item.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in appointments" :key="index">
                        <td>{{ item.tooth ? item.tooth.number : "" }}</td>
                        <td>{{ item.diagnosis ? item.diagnosis.name : "" }}</td>
                        <td>{{ item.treatment ? item.treatment.name : "" }}</td>
                        <td>
                          <v-btn
                            class="cursor-pointer"
                            small
                            icon
                            flat
                            color="green"
                            variant="text"
                            title="Edit"
                            @click="editAppointmentDetails(item, index)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn
                            class="cursor-pointer"
                            small
                            icon
                            flat
                            color="red"
                            variant="text"
                            title="Delete"
                            @click="remove(item, index)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                          <v-btn
                            v-if="index === appointments.length - 1 && !addMore"
                            class="cursor-pointer"
                            small
                            icon
                            flat
                            color="green"
                            variant="text"
                            title="Add More"
                            @click="add"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      <tr v-if="addMore">
                        <td>
                          {{
                            appointment.tooth ? appointment.tooth.number : ""
                          }}
                        </td>
                        <td>
                          <v-combobox
                            v-model="appointment.diagnosis"
                            class="mt-2 input-width"
                            :label="$t('singleAppointment.diagnostic')"
                            item-title="name"
                            item-value="id"
                            hide-details
                            :items="diagnostics"
                            :search-input.sync="diagnosisSearch"
                            @keyup.enter="appendNewDiagnostic"
                          ></v-combobox>
                        </td>
                        <td>
                          <v-combobox
                            v-model="appointment.treatment"
                            class="mt-2 input-width"
                            :label="$t('singleAppointment.treatment')"
                            item-title="name"
                            item-value="id"
                            hide-details
                            :items="treatments"
                            :search-input.sync="treatmentSearch"
                            @keyup.enter="appendNewTreatment"
                          ></v-combobox>
                        </td>
                        <td>
                          <v-btn
                            v-if="appointments.length"
                            class="cursor-pointer"
                            large
                            icon
                            flat
                            color="red"
                            variant="text"
                            title="Cancel"
                            @click="cancel"
                          >
                            <v-icon>mdi-minus</v-icon>
                          </v-btn>

                          <v-btn
                            class="cursor-pointer"
                            large
                            icon
                            flat
                            color="green"
                            variant="text"
                            title="Save"
                            @click="saveAppointmentDetails"
                          >
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
                <v-window-item value="two">
                  <QuestionExpansion
                    :userId="selectedPatient"
                  ></QuestionExpansion>
                </v-window-item>
                <v-window-item value="three">
                  <v-textarea
                    v-model="note"
                    :label="$t('singleAppointment.text')"
                    no-resize
                    hide-details
                  ></v-textarea>
                </v-window-item>
                <v-window-item value="Four">
                  <v-table fixed-header hover class="mt-5">
                    <thead>
                      <tr>
                        <th
                          v-for="(item, index) in appointmentFileHeaders"
                          :key="index"
                        >
                          {{ item.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in appointmentFiles"
                        :key="index"
                      >
                        <td>{{ item.name }}</td>
                        <td>{{ item.createdAt }}</td>
                        <td>
                          <v-btn
                            v-if="item.id"
                            @click="downloadFile(item)"
                            class="cursor-pointer"
                            small
                            icon
                            flat
                            color="green"
                            variant="text"
                            title="Download"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <v-file-input
                            class="mt-2"
                            clearable
                            :label="$t('singleAppointment.fileInput')"
                            v-model="selectedFiles"
                            placeholder="Upload your files"
                            multiple
                            hide-details
                          >
                          </v-file-input>
                        </td>
                        <td>
                          <v-btn
                            dark
                            color="green"
                            class="mr-0"
                            small
                            title="Save"
                            @click="saveSelectedFiles"
                          >
                            <v-icon>mdi-content-save</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col>
          <v-card>
            <v-tabs v-model="tab" color="info" slider-color="info">
              <v-tab value="one">Treatment</v-tab>
              <v-tab value="Four">Files</v-tab>
            </v-tabs>

            <v-card-text>
              <v-window v-model="tab" class="min-height">
                <v-window-item value="one">
                  <v-table fixed-header hover>
                    <thead>
                      <tr>
                        <th v-for="item in patientTableHeader" :key="item.id">
                          {{ item.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in appointments" :key="index">
                        <td>{{ item.tooth ? item.tooth.number : "" }}</td>
                        <td>{{ item.diagnosis ? item.diagnosis.name : "" }}</td>
                        <td>{{ item.treatment ? item.treatment.name : "" }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
                <v-window-item value="Four">
                  <v-table fixed-header hover class="mt-5">
                    <thead>
                      <tr>
                        <th
                          v-for="(item, index) in appointmentFileHeaders"
                          :key="index"
                        >
                          {{ item.text }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in appointmentFiles"
                        :key="index"
                      >
                        <td>{{ item.name }}</td>
                        <td>{{ item.createdAt }}</td>
                        <td>
                          <v-btn
                            v-if="item.id"
                            @click="downloadFile(item)"
                            class="cursor-pointer"
                            small
                            icon
                            flat
                            color="green"
                            variant="text"
                            title="Download"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <BaseConfirmationDialog ref="confirmation" />
    </Form>
  </ClientOnly>
</template>

<style>
.min-height {
  min-height: 180px;
}
.input-width {
  max-width: 350px;
  min-width: 310px;
}
.dp__input_icon {
  display: none;
}
.dp__button svg {
  color: #0088DF;
}
.dp__select{
  color: #0088DF;
}
.dp__input {
    background-color:#E5ECF0;
    border-radius: 4px 4px 0 0;
    border: none;
    outline: none;
    font-size: 1rem;
    padding: 16px 12px;
    box-sizing: border-box;
}
.dp__input:hover{
  background-color: #DDE5E8;
  transition: all 0.3s ease-in-out;
}
.dp__input::placeholder{
  color: #505252;
  font-weight: 400;
  font-family: "Nunito", sans-serif !important;
}
</style>
