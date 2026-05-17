import React, { useEffect, useMemo, useState } from "react";
import {
  FaAmbulance,
  FaBoxes,
  FaBrain,
  FaCalendarCheck,
  FaChartBar,
  FaChartLine,
  FaClock,
  FaExclamationTriangle,
  FaHeartbeat,
  FaHospital,
  FaMoneyBillWave,
  FaNotesMedical,
  FaProcedures,
  FaStethoscope,
  FaUserShield,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";

import Button from "../../components/admin/Button";
import Layout from "../../components/admin/Layout";
import { api } from "../../state/api";

const emptyAnalytics = {
  patientAnalytics: {
    visits: { daily: 0, weekly: 0, monthly: 0, lastSevenDays: [] },
    mostCommonDiseases: [],
    departmentLoad: [],
    revenue: { monthly: [], byDepartment: [], totalEstimated: 0, note: "" },
  },
  appointmentPrediction: { rushTimeSlots: [], noShowRisk: [], busiestSlot: null },
  diseaseTrend: { commonPatterns: [], seasonal: [], note: "" },
  inventoryForecast: [],
  workload: { doctorWise: [], opdIpd: [], staffUtilization: [] },
  advancedModels: {
    demandForecast: { next14Days: [], departmentForecast: [], highDemandDepartments: [] },
    queueForecast: [],
    patientRiskSegmentation: { highRisk: 0, mediumRisk: 0, lowRisk: 0, topPatients: [] },
    resourceOptimizer: { averageLoad: 0, doctorUtilization: [], departmentGaps: [] },
    anomalyDetection: [],
  },
  recommendation: null,
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const maxValue = (items) => Math.max(...items.map((item) => item.value || 0), 1);

const Section = ({ title, subtitle, icon: Icon, children }) => (
  <section className="rounded-3xl border bg-white p-6 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon />
      </div>
      <div>
        <div className="text-lg font-extrabold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
      </div>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const Metric = ({ title, value, subtitle, icon: Icon, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-600">{title}</div>
        <div className={`grid h-10 w-10 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
          <Icon />
        </div>
      </div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
    </div>
  );
};

const BarList = ({ items, accent = "bg-brand-600", empty = "No data available." }) => {
  const max = maxValue(items);

  if (!items.length) return <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{empty}</div>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-semibold text-slate-700">{item.label}</span>
            <span className="shrink-0 text-slate-500">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${accent}`}
              style={{ width: `${Math.max(8, Math.round(((item.value || 0) / max) * 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const VerticalBars = ({ items, accent = "bg-brand-600", valueFormatter = (value) => value }) => {
  const max = maxValue(items);

  if (!items.length) return <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No trend data yet.</div>;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => (
        <div key={item.label} className="flex min-h-36 flex-col justify-end rounded-2xl bg-slate-50 p-3">
          <div
            className={`rounded-t-xl ${accent}`}
            style={{ height: `${item.value ? Math.max(14, ((item.value || 0) / max) * 88) : 6}px` }}
          />
          <div className="mt-2 truncate text-center text-xs font-bold text-slate-700">{item.label}</div>
          <div className="text-center text-xs text-slate-500">{valueFormatter(item.value || 0)}</div>
        </div>
      ))}
    </div>
  );
};

const RiskBadge = ({ value }) => {
  const tone =
    value === "High"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : value === "Medium"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${tone}`}>{value}</span>;
};

const ModelTile = ({ title, value, subtitle, icon: Icon, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-bold uppercase text-slate-500">{title}</div>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ring-1 ${tones[tone]}`}>
          <Icon />
        </div>
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{subtitle}</div>
    </div>
  );
};

const SignalList = ({ items, empty = "No model signals yet." }) => {
  if (!items.length) return <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{empty}</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={`${item.label}-${item.detail || item.action || item.value}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="font-bold text-slate-800">{item.label}</div>
              <div className="mt-1 text-sm text-slate-600">{item.detail || item.action || item.department || "Model signal"}</div>
            </div>
            <RiskBadge value={item.risk || "Low"} />
          </div>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [recommending, setRecommending] = useState(false);
  const [symptoms, setSymptoms] = useState("fever cough chest pain weakness");
  const [vitals, setVitals] = useState({ temperature: "101", heartRate: "96", spo2: "97" });
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/api/v1/analytics/hospital");
        setAnalytics(data.analytics || emptyAnalytics);
        setRecommendation(data.analytics?.recommendation || null);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const patient = analytics.patientAnalytics || emptyAnalytics.patientAnalytics;
  const prediction = analytics.appointmentPrediction || emptyAnalytics.appointmentPrediction;
  const disease = analytics.diseaseTrend || emptyAnalytics.diseaseTrend;
  const inventory = analytics.inventoryForecast || [];
  const workload = analytics.workload || emptyAnalytics.workload;
  const advanced = analytics.advancedModels || emptyAnalytics.advancedModels;
  const demandForecast = advanced.demandForecast || emptyAnalytics.advancedModels.demandForecast;
  const patientRisk = advanced.patientRiskSegmentation || emptyAnalytics.advancedModels.patientRiskSegmentation;
  const resourceOptimizer = advanced.resourceOptimizer || emptyAnalytics.advancedModels.resourceOptimizer;
  const queueForecast = advanced.queueForecast || [];
  const anomalyDetection = advanced.anomalyDetection || [];
  const visits = patient.visits || emptyAnalytics.patientAnalytics.visits;
  const maxQueueWait = Math.max(...queueForecast.map((item) => item.value || 0), 0);
  const highAnomalies = anomalyDetection.filter((item) => item.risk === "High").length;

  const revenueMonths = useMemo(
    () => (patient.revenue?.monthly || []).map((item) => ({ ...item, label: item.label.slice(5) })),
    [patient.revenue?.monthly]
  );

  const runRecommendation = async () => {
    setRecommending(true);
    try {
      const { data } = await api.post("/api/v1/analytics/recommend", { symptoms, vitals });
      setRecommendation(data.recommendation);
      toast.success("Recommendation updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Recommendation failed");
    } finally {
      setRecommending(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-2xl font-extrabold text-slate-900">ML & Data Analytics</div>
            <div className="mt-1 text-sm text-slate-600">
              Patient analytics, prediction, trends, inventory forecast, workload and triage recommendations.
            </div>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
            {analytics.scope || "Hospital-wide"}
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border bg-white p-6 text-sm text-slate-600 shadow-sm">Loading analytics...</div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Metric title="Daily Visits" value={visits.daily} subtitle="appointments for today" icon={FaUsers} />
              <Metric title="Weekly Visits" value={visits.weekly} subtitle="last 7 days demand" icon={FaChartLine} tone="green" />
              <Metric title="Monthly Visits" value={visits.monthly} subtitle="current month load" icon={FaChartBar} tone="amber" />
              <Metric
                title="Estimated Revenue"
                value={money(patient.revenue?.totalEstimated)}
                subtitle="accepted appointments"
                icon={FaMoneyBillWave}
                tone="green"
              />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Section
                title="Patient Analytics Dashboard"
                subtitle="Daily, weekly, monthly visits with disease, department and revenue trends."
                icon={FaChartBar}
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Last 7 Days Patient Visits</div>
                    <VerticalBars items={visits.lastSevenDays || []} accent="bg-brand-600" />
                  </div>
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div>
                      <div className="mb-3 text-sm font-bold text-slate-700">Most Common Diseases</div>
                      <BarList items={patient.mostCommonDiseases || []} accent="bg-rose-500" />
                    </div>
                    <div>
                      <div className="mb-3 text-sm font-bold text-slate-700">Department-wise Patient Load</div>
                      <BarList items={patient.departmentLoad || []} accent="bg-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Revenue and Billing Trends</div>
                    <VerticalBars items={revenueMonths} accent="bg-emerald-600" valueFormatter={money} />
                    {patient.revenue?.note ? <div className="mt-3 text-xs text-slate-500">{patient.revenue.note}</div> : null}
                  </div>
                </div>
              </Section>

              <Section
                title="Appointment Prediction"
                subtitle="Rush time slot detection and no-show risk scoring from appointment history."
                icon={FaClock}
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Rush Time Slots</div>
                    <BarList items={prediction.rushTimeSlots || []} accent="bg-amber-500" />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">No-show Prediction</div>
                    <div className="overflow-hidden rounded-2xl border">
                      <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600">
                        <div className="col-span-4">Patient</div>
                        <div className="col-span-3">Department</div>
                        <div className="col-span-3">Date</div>
                        <div className="col-span-2 text-right">Risk</div>
                      </div>
                      {(prediction.noShowRisk || []).length ? (
                        prediction.noShowRisk.map((item) => (
                          <div key={`${item.patient}-${item.appointmentDate}`} className="grid grid-cols-12 px-4 py-3 text-sm text-slate-700">
                            <div className="col-span-4 truncate font-semibold">{item.patient}</div>
                            <div className="col-span-3 truncate">{item.department}</div>
                            <div className="col-span-3">{item.appointmentDate}</div>
                            <div className="col-span-2 text-right font-bold text-rose-600">{item.score}%</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-5 text-sm text-slate-600">No appointment risk data yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            <Section
              title="Advanced ML Model Suite"
              subtitle="Forecasting, patient risk scoring, queue prediction, capacity planning and anomaly detection."
              icon={FaBrain}
            >
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ModelTile
                  title="Demand Models"
                  value={demandForecast.departmentForecast?.length || 0}
                  subtitle="departments forecasted"
                  icon={FaHospital}
                />
                <ModelTile
                  title="High Risk Patients"
                  value={patientRisk.highRisk || 0}
                  subtitle={`${patientRisk.mediumRisk || 0} medium risk cases`}
                  icon={FaUserShield}
                  tone={(patientRisk.highRisk || 0) ? "rose" : "green"}
                />
                <ModelTile
                  title="Max Queue Wait"
                  value={`${maxQueueWait}m`}
                  subtitle="predicted peak wait"
                  icon={FaClock}
                  tone={maxQueueWait >= 75 ? "rose" : maxQueueWait >= 45 ? "amber" : "green"}
                />
                <ModelTile
                  title="Anomaly Alerts"
                  value={anomalyDetection.length}
                  subtitle={`${highAnomalies} high severity`}
                  icon={FaExclamationTriangle}
                  tone={highAnomalies ? "rose" : "amber"}
                />
              </div>
            </Section>

            <div className="grid gap-4 xl:grid-cols-2">
              <Section
                title="Demand Forecasting Model"
                subtitle="Next 14 days projection with department capacity pressure."
                icon={FaCalendarCheck}
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Next 14 Days Forecast</div>
                    <VerticalBars items={demandForecast.next14Days || []} accent="bg-brand-600" />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Department Capacity Risk</div>
                    <div className="space-y-3">
                      {(demandForecast.departmentForecast || []).length ? (
                        demandForecast.departmentForecast.map((item) => (
                          <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <div className="font-bold text-slate-800">{item.label}</div>
                                <div className="text-sm text-slate-600">
                                  {item.projectedDaily}/day | capacity {item.dailyCapacity}/day | pending {item.pending}
                                </div>
                              </div>
                              <RiskBadge value={item.risk} />
                            </div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                              <div className="h-full rounded-full bg-brand-600" style={{ width: `${Math.min(item.loadScore || 0, 100)}%` }} />
                            </div>
                            <div className="mt-2 text-xs font-semibold text-slate-600">{item.action}</div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No demand forecast yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="Patient Risk Stratification"
                subtitle="Priority scoring from age, department severity, status and no-show signals."
                icon={FaHeartbeat}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <ModelTile title="High" value={patientRisk.highRisk || 0} subtitle="urgent follow-up" icon={FaHeartbeat} tone="rose" />
                  <ModelTile title="Medium" value={patientRisk.mediumRisk || 0} subtitle="monitor today" icon={FaUserShield} tone="amber" />
                  <ModelTile title="Low" value={patientRisk.lowRisk || 0} subtitle="normal flow" icon={FaUsers} tone="green" />
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl border">
                  <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-600">
                    <div className="col-span-4">Patient</div>
                    <div className="col-span-3">Department</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-3 text-right">Risk</div>
                  </div>
                  {(patientRisk.topPatients || []).length ? (
                    patientRisk.topPatients.map((item) => (
                      <div key={`${item.patient}-${item.appointmentDate}`} className="grid grid-cols-12 px-4 py-3 text-sm text-slate-700">
                        <div className="col-span-4 truncate font-semibold">{item.patient}</div>
                        <div className="col-span-3 truncate">{item.department}</div>
                        <div className="col-span-2 font-bold">{item.value}%</div>
                        <div className="col-span-3 text-right">
                          <RiskBadge value={item.risk} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-5 text-sm text-slate-600">No patient risk data yet.</div>
                  )}
                </div>
              </Section>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Section
                title="Queue Wait Prediction"
                subtitle="Time-slot wait prediction for OPD desk and doctor scheduling."
                icon={FaClock}
              >
                <div className="space-y-4">
                  {queueForecast.length ? (
                    queueForecast.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-slate-800">{item.label}</div>
                            <div className="text-sm text-slate-600">
                              {item.appointments} appointments | {item.pending} pending
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-extrabold text-slate-900">{item.value}m</div>
                            <RiskBadge value={item.risk} />
                          </div>
                        </div>
                        <div className="mt-2 text-xs font-semibold text-slate-600">{item.action}</div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No queue forecast yet.</div>
                  )}
                </div>
              </Section>

              <Section
                title="Resource Optimizer"
                subtitle="Doctor load balancing and department staffing gap suggestions."
                icon={FaProcedures}
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Doctor Utilization</div>
                    <SignalList items={(resourceOptimizer.doctorUtilization || []).slice(0, 6)} empty="No doctor utilization yet." />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Department Gaps</div>
                    <SignalList items={(resourceOptimizer.departmentGaps || []).slice(0, 6)} empty="No department gaps yet." />
                  </div>
                </div>
              </Section>
            </div>

            <Section
              title="Anomaly Detection"
              subtitle="Operational signals for duplicate bookings, overdue pending requests and demand spikes."
              icon={FaExclamationTriangle}
            >
              <SignalList items={anomalyDetection} />
            </Section>

            <div className="grid gap-4 xl:grid-cols-2">
              <Section
                title="Disease Trend Analysis"
                subtitle="Common disease patterns and seasonal disease signals such as flu, dengue and viral fever."
                icon={FaNotesMedical}
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Common Patterns</div>
                    <BarList items={disease.commonPatterns || []} accent="bg-rose-500" />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Seasonal Disease Forecast</div>
                    <BarList items={disease.seasonal || []} accent="bg-amber-500" />
                  </div>
                </div>
                {disease.note ? <div className="mt-4 text-xs text-slate-500">{disease.note}</div> : null}
              </Section>

              <Section
                title="Medicine / Inventory Forecasting"
                subtitle="Medicine usage estimate, low-stock signal and reorder prediction."
                icon={FaBoxes}
              >
                <div className="space-y-3">
                  {inventory.length ? (
                    inventory.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-slate-800">{item.label}</div>
                            <div className="text-sm text-slate-600">
                              Forecast use: {item.forecastUsage} | Stock: {item.currentStock} | Reorder point: {item.reorderPoint}
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${
                              item.reorderNeeded
                                ? "bg-rose-50 text-rose-700 ring-rose-200"
                                : "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            }`}
                          >
                            {item.reorderNeeded ? "Reorder" : "Stock OK"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No inventory forecast yet.</div>
                  )}
                </div>
              </Section>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <Section
                title="Doctor / Staff Workload Analysis"
                subtitle="Doctor-wise appointments, OPD/IPD load and staff utilization."
                icon={FaUserMd}
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">Doctor-wise Appointments</div>
                    <BarList items={workload.doctorWise || []} accent="bg-brand-600" />
                  </div>
                  <div>
                    <div className="mb-3 text-sm font-bold text-slate-700">OPD / IPD Load</div>
                    <BarList items={workload.opdIpd || []} accent="bg-emerald-600" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="mb-3 text-sm font-bold text-slate-700">Staff Utilization</div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(workload.staffUtilization || []).length ? (
                      workload.staffUtilization.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="font-bold text-slate-800">{item.label}</div>
                              <div className="text-sm text-slate-600">{item.department}</div>
                            </div>
                            <div className="text-xl font-extrabold text-brand-700">{item.utilization}%</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No staff utilization data yet.</div>
                    )}
                  </div>
                </div>
              </Section>

              <Section
                title="Basic ML Recommendation"
                subtitle="Symptoms se suggested department, emergency priority score and patient risk category."
                icon={FaBrain}
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700">Symptoms / Diagnosis Notes</label>
                      <textarea
                        value={symptoms}
                        onChange={(event) => setSymptoms(event.target.value)}
                        rows={5}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600">Temp</label>
                        <input
                          value={vitals.temperature}
                          onChange={(event) => setVitals((prev) => ({ ...prev, temperature: event.target.value }))}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600">Heart Rate</label>
                        <input
                          value={vitals.heartRate}
                          onChange={(event) => setVitals((prev) => ({ ...prev, heartRate: event.target.value }))}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600">SpO2</label>
                        <input
                          value={vitals.spo2}
                          onChange={(event) => setVitals((prev) => ({ ...prev, spo2: event.target.value }))}
                          className="mt-2 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
                        />
                      </div>
                    </div>
                    <Button onClick={runRecommendation} disabled={recommending} className="w-full">
                      {recommending ? "Checking..." : "Run Recommendation"}
                    </Button>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                    {recommendation ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-bold text-slate-600">Suggested Department</div>
                            <div className="mt-1 text-2xl font-extrabold text-slate-900">
                              {recommendation.suggestedDepartment}
                            </div>
                          </div>
                          <FaStethoscope className="text-2xl text-brand-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white p-4">
                            <div className="text-xs font-bold text-slate-600">Priority Score</div>
                            <div className="mt-1 text-2xl font-extrabold text-rose-600">
                              {recommendation.priorityScore}
                            </div>
                          </div>
                          <div className="rounded-2xl bg-white p-4">
                            <div className="text-xs font-bold text-slate-600">Risk Category</div>
                            <div className="mt-2">
                              <RiskBadge value={recommendation.riskCategory} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-700">Likely Conditions</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(recommendation.likelyConditions || []).map((condition) => (
                              <span key={condition} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-700">
                          <FaAmbulance className="mr-2 inline text-rose-600" />
                          {recommendation.action}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600">Run recommendation to see triage output.</div>
                    )}
                  </div>
                </div>
              </Section>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
