import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  BarChart3,
  CheckCircle2,
  Clock,
  PlusCircle,
  Printer,
  Smartphone,
  Store,
  TrendingUp,
  Wrench,
  Trash2,
} from 'lucide-react'

const STORAGE_KEY = 'phone-repair-shop-data'
const LOGO_SRC = '/logo.png.jpg'

const SHOP = {
  name: 'M-Mobile ဖုန်းအမျိုးမျိုးအထူးပြုပြင်ရေး',
  tagline: 'ယုံကြည်စိတ်ချရသော ဖုန်းပြင်ဆင်ဝန်ဆောင်မှု',
  phone: '09-428-88-3022',
  address: 'တောင်ကြီးမြို့၊ Myanmar',
}

const STATUS = {
  pending: { label: 'စောင့်ဆိုင်းဆဲ', color: 'bg-amber-500/15 text-amber-400 ring-amber-500/30' },
  repairing: { label: 'ပြင်ဆင်ဆဲ', color: 'bg-sky-500/15 text-sky-400 ring-sky-500/30' },
  completed: { label: 'ပြီးစီးပြီ', color: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30' },
}

const MYANMAR_MONTHS = [
  'ဇန်နဝါရီ',
  'ဖေဖော်ဝါရီ',
  'မတ်',
  'ဧပြီ',
  'မေ',
  'ဇွန်',
  'ဇူလိုင်',
  'ဩဂုတ်',
  'စက်တင်ဘာ',
  'အောက်တိုဘာ',
  'နိုဝင်ဘာ',
  'ဒီဇင်ဘာ',
]

const INITIAL_JOBS = [
  {
    id: 1,
    customerName: 'ဦးကျော်မြင့်',
    phoneModel: 'iPhone 14 Pro',
    issue: 'ဖန်သားကွဲ',
    sparePartCost: 85000,
    serviceFee: 15000,
    status: 'repairing',
    date: '2026-06-15',
  },
  {
    id: 2,
    customerName: 'ဒေါ်သန်းသန်း',
    phoneModel: 'Samsung S23 Ultra',
    issue: 'ဘက်ထရီ မကြာခဏကုန်',
    sparePartCost: 45000,
    serviceFee: 10000,
    status: 'pending',
    date: '2026-06-17',
  },
  {
    id: 3,
    customerName: 'ကိုမင်းမင်း',
    phoneModel: 'Xiaomi Redmi Note 13',
    issue: 'charging port ပျက်',
    sparePartCost: 12000,
    serviceFee: 8000,
    status: 'completed',
    date: '2026-06-10',
  },
  {
    id: 4,
    customerName: 'Ma Su Hlaing',
    phoneModel: 'Oppo Reno 10',
    issue: 'ကင်မရာ မရှင်း',
    sparePartCost: 28000,
    serviceFee: 12000,
    status: 'completed',
    date: '2026-05-22',
  },
  {
    id: 5,
    customerName: 'ဦးအောင်သန်း',
    phoneModel: 'Huawei P60',
    issue: 'speaker အသံ မထွက်',
    sparePartCost: 18000,
    serviceFee: 9000,
    status: 'completed',
    date: '2026-04-08',
  },
]

const EMPTY_PHONE = {
  phoneModel: '',
  issue: '',
}

function createEmptyForm() {
  return {
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    phones: [{ ...EMPTY_PHONE }],
    sparePartCost: '',
    serviceFee: '',
    status: 'pending',
  }
}

function loadStoredData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { jobs: INITIAL_JOBS, nextId: 6 }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.jobs)) return { jobs: INITIAL_JOBS, nextId: 6 }
    return {
      jobs: parsed.jobs,
      nextId: typeof parsed.nextId === 'number' ? parsed.nextId : parsed.jobs.length + 1,
    }
  } catch {
    return { jobs: INITIAL_JOBS, nextId: 6 }
  }
}

function formatKs(amount) {
  return `${Number(amount).toLocaleString('my-MM')} ကျပ်`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('my-MM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-surface-600 bg-surface-800/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-sm font-medium text-slate-300">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatKs(entry.value)}
        </p>
      ))}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  const accents = {
    sky: 'from-sky-500/20 to-sky-600/5 text-sky-400',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400',
    emerald: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400',
    violet: 'from-violet-500/20 to-violet-600/5 text-violet-400',
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-surface-700/80 bg-surface-800/60 p-5 backdrop-blur-sm transition hover:border-surface-600 hover:bg-surface-800">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${accents[accent]} opacity-60 blur-2xl transition group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className={`rounded-xl bg-gradient-to-br p-2.5 ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}

function printVoucher(job) {
  const total = job.sparePartCost + job.serviceFee
  const statusLabel = STATUS[job.status]?.label ?? job.status
  const html = `<!DOCTYPE html>
<html lang="my">
<head>
  <meta charset="UTF-8" />
  <title>ဘောင်ချာ #${job.id} — ${SHOP.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans Myanmar', 'Myanmar Text', sans-serif;
      padding: 24px;
      max-width: 380px;
      margin: 0 auto;
      color: #111;
      font-size: 14px;
      line-height: 1.6;
    }
    .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 16px; margin-bottom: 16px; }
    .logo { display: block; height: 64px; width: 64px; object-fit: contain; margin: 0 auto 8px; }
    .shop-name { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .shop-info { font-size: 12px; color: #555; }
    .receipt-no { text-align: center; font-size: 12px; color: #666; margin-bottom: 16px; }
    .section { margin-bottom: 14px; }
    .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #888; margin-bottom: 6px; letter-spacing: 0.5px; }
    .row { display: flex; justify-content: space-between; padding: 4px 0; }
    .row.total { border-top: 2px solid #111; margin-top: 8px; padding-top: 10px; font-weight: 700; font-size: 16px; }
    .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
    .footer { text-align: center; font-size: 11px; color: #888; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #ccc; }
    @media print {
      body { padding: 12px; }
      @page { margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img class="logo" src="${window.location.origin}${LOGO_SRC}" alt="${SHOP.name}" />
    <div class="shop-name">${SHOP.name}</div>
    <div class="shop-info">${SHOP.tagline}</div>
    <div class="shop-info">${SHOP.phone} · ${SHOP.address}</div>
  </div>
  <div class="receipt-no">ဘောင်ချာနံပါတ် #${String(job.id).padStart(4, '0')} · ${formatDate(job.date)}</div>
  <div class="section">
    <div class="section-title">ဖောက်သည်အချက်အလက်</div>
    <div class="row"><span>အမည်</span><span>${job.customerName}</span></div>
    <div class="row"><span>ဖုန်းမော်ဒယ်</span><span>${job.phoneModel}</span></div>
    <div class="row"><span>ပြဿနာ</span><span>${job.issue}</span></div>
    <div class="row"><span>အခြေအနေ</span><span>${statusLabel}</span></div>
  </div>
  <div class="divider"></div>
  <div class="section">
    <div class="section-title">ကုန်ကျစရိတ်အသေးစိတ်</div>
    <div class="row"><span>အစိတ်အပိုင်းကုန်ကျ</span><span>${formatKs(job.sparePartCost)}</span></div>
    <div class="row"><span>ဝန်ဆောင်ခ</span><span>${formatKs(job.serviceFee)}</span></div>
    <div class="row total"><span>စုစုပေါင်း</span><span>${formatKs(total)}</span></div>
  </div>
  <div class="footer">
    ကျေးဇူးတင်ပါသည် — ${SHOP.name}<br/>
    ပြန်လည်လာရောက်ရန် နှုတ်ခွန်းဆက်ပါသည်
  </div>
</body>
</html>`

  const printWindow = window.open('', '_blank', 'width=420,height=640')
  if (!printWindow) return
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  printWindow.onload = () => {
    printWindow.print()
  }
}

function App() {
  const [jobs, setJobs] = useState(() => loadStoredData().jobs)
  const [nextId, setNextId] = useState(() => loadStoredData().nextId)
  const [form, setForm] = useState(createEmptyForm)
  const [chartView, setChartView] = useState('monthly')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ jobs, nextId }))
  }, [jobs, nextId])

  const activeJobs = jobs.filter((j) => j.status !== 'completed')
  const sortedJobs = useMemo(
    () => [...jobs].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [jobs],
  )

  const stats = useMemo(() => {
    const completed = jobs.filter((j) => j.status === 'completed')
    const totalIncome = completed.reduce(
      (sum, j) => sum + j.sparePartCost + j.serviceFee,
      0,
    )
    return {
      total: jobs.length,
      pending: jobs.filter((j) => j.status === 'pending').length,
      repairing: jobs.filter((j) => j.status === 'repairing').length,
      totalIncome,
    }
  }, [jobs])

  const monthlyData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
      const month = d.getMonth()
      const year = d.getFullYear()
      const monthJobs = jobs.filter((j) => {
        const jd = new Date(j.date)
        return (
          j.status === 'completed' &&
          jd.getMonth() === month &&
          jd.getFullYear() === year
        )
      })
      const income = monthJobs.reduce(
        (s, j) => s + j.sparePartCost + j.serviceFee,
        0,
      )
      const spareParts = monthJobs.reduce((s, j) => s + j.sparePartCost, 0)
      const service = monthJobs.reduce((s, j) => s + j.serviceFee, 0)
      return {
        name: MYANMAR_MONTHS[month].slice(0, 3),
        fullName: `${MYANMAR_MONTHS[month]} ${year}`,
        income,
        spareParts,
        service,
      }
    })
  }, [jobs])

  const yearlyData = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - (4 - i)
      const yearJobs = jobs.filter((j) => {
        const jd = new Date(j.date)
        return j.status === 'completed' && jd.getFullYear() === year
      })
      const income = yearJobs.reduce(
        (s, j) => s + j.sparePartCost + j.serviceFee,
        0,
      )
      const spareParts = yearJobs.reduce((s, j) => s + j.sparePartCost, 0)
      const service = yearJobs.reduce((s, j) => s + j.serviceFee, 0)
      return {
        name: `${year}`,
        fullName: `${year} ခုနှစ်`,
        income,
        spareParts,
        service,
      }
    })
  }, [jobs])

  const chartData = chartView === 'monthly' ? monthlyData : yearlyData

  const previewPhones = form.phones.filter(
    (phone) => phone.phoneModel.trim() && phone.issue.trim(),
  )

  function updatePhone(index, field, value) {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.map((phone, i) =>
        i === index ? { ...phone, [field]: value } : phone,
      ),
    }))
  }

  function addPhone() {
    setForm((prev) => ({
      ...prev,
      phones: [...prev.phones, { ...EMPTY_PHONE }],
    }))
  }

  function removePhone(index) {
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.length > 1
        ? prev.phones.filter((_, i) => i !== index)
        : prev.phones,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validPhones = form.phones.filter(
      (phone) => phone.phoneModel.trim() && phone.issue.trim(),
    )
    if (!form.customerName.trim() || validPhones.length === 0) return

    const newJobs = validPhones.map((phone, index) => ({
      id: nextId + index,
      customerName: form.customerName.trim(),
      phoneModel: phone.phoneModel.trim(),
      issue: phone.issue.trim(),
      sparePartCost: Number(form.sparePartCost) || 0,
      serviceFee: Number(form.serviceFee) || 0,
      status: form.status,
      date: form.date,
    }))

    setJobs((prev) => [...newJobs, ...prev])
    setNextId((id) => id + validPhones.length)
    setForm(createEmptyForm())
  }

  function updateStatus(id, status) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status } : j)),
    )
  }

  return (
    <div className="min-h-svh bg-surface-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-sky-600/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-600/8 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Shop Branding Banner */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-surface-700/80 bg-gradient-to-r from-surface-900/90 via-surface-800/80 to-surface-900/90 backdrop-blur-sm">
          <div className="relative flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between sm:px-10">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-violet-500/5 to-emerald-500/5" />
            <div className="relative flex flex-col items-center gap-4 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/20 to-violet-600/20 shadow-lg shadow-sky-500/10">
                <img
                  src={LOGO_SRC}
                  alt="M-Mobile Logo"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {SHOP.name}
                </h1>
                <p className="mt-1 text-base text-sky-300/80">{SHOP.tagline}</p>
                <p className="mt-2 text-sm text-slate-400">
                  {SHOP.phone} · {SHOP.address}
                </p>
              </div>
            </div>
            <div className="relative flex flex-col items-center gap-2 rounded-xl border border-surface-600/60 bg-surface-800/60 px-5 py-3 text-center sm:items-end sm:text-right">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                စနစ်အသက်ဝင်နေသည်
              </div>
              <p className="text-sm text-slate-300">
                {new Date().toLocaleDateString('my-MM', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-slate-500">ဒေတာများ localStorage တွင် သိမ်းဆည်းထားသည်</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Smartphone} label="စုစုပေါင်းအလုပ်များ" value={stats.total} accent="sky" />
          <StatCard icon={Clock} label="စောင့်ဆိုင်းဆဲ" value={stats.pending} accent="amber" />
          <StatCard icon={Wrench} label="ပြင်ဆင်ဆဲ" value={stats.repairing} accent="violet" />
          <StatCard icon={TrendingUp} label="စုစုပေါင်းဝင်ငွေ" value={formatKs(stats.totalIncome)} accent="emerald" />
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Jobs Table — all jobs with print */}
          <section className="xl:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-surface-700/80 bg-surface-900/60 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-surface-700/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-sky-500/15 p-2">
                    <Wrench className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">လက်ရှိပြင်ဆင်ဆဲဖုန်းများ</h2>
                    <p className="text-xs text-slate-400">
                      စုစုပေါင်း {jobs.length} ခု · ပြင်ဆင်ဆဲ {activeJobs.length} ခု
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-medium text-sky-400">
                  {activeJobs.length} ခု လက်ရှိ
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-700/60 bg-surface-800/40 text-xs uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-3.5 font-medium">ဖောက်သည်အမည်</th>
                      <th className="px-4 py-3.5 font-medium">ဖုန်းမော်ဒယ်</th>
                      <th className="px-4 py-3.5 font-medium">ပြဿနာ</th>
                      <th className="px-4 py-3.5 font-medium">အစိတ်အပိုင်းကုန်ကျ</th>
                      <th className="px-4 py-3.5 font-medium">ဝန်ဆောင်ခ</th>
                      <th className="px-4 py-3.5 font-medium">အခြေအနေ</th>
                      <th className="px-4 py-3.5 font-medium">လုပ်ဆောင်ချက်</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-700/40">
                    {sortedJobs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500/50" />
                          ပြင်ဆင်မှု စာရင်းမရှိသေးပါ
                        </td>
                      </tr>
                    ) : (
                      sortedJobs.map((job) => (
                        <tr
                          key={job.id}
                          className={`transition hover:bg-surface-800/30 ${job.status === 'completed' ? 'opacity-60' : ''}`}
                        >
                          <td className="px-6 py-4 font-medium text-white">{job.customerName}</td>
                          <td className="px-4 py-4 text-slate-300">{job.phoneModel}</td>
                          <td className="max-w-[140px] truncate px-4 py-4 text-slate-400" title={job.issue}>
                            {job.issue}
                          </td>
                          <td className="px-4 py-4 text-slate-300">{formatKs(job.sparePartCost)}</td>
                          <td className="px-4 py-4 text-slate-300">{formatKs(job.serviceFee)}</td>
                          <td className="px-4 py-4">
                            <select
                              value={job.status}
                              onChange={(e) => updateStatus(job.id, e.target.value)}
                              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset outline-none transition focus:ring-2 focus:ring-sky-500/50 ${STATUS[job.status].color}`}
                            >
                              {Object.entries(STATUS).map(([key, { label }]) => (
                                <option key={key} value={key} className="bg-surface-800 text-slate-200">
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => printVoucher(job)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-surface-600 bg-surface-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
                              title="ဘောင်ချာထုတ်ရန်"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              ဘောင်ချာထုတ်ရန်
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Add New Job Form */}
          <section>
            <div className="rounded-2xl border border-surface-700/80 bg-surface-900/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-surface-700/80 px-6 py-4">
                <div className="rounded-lg bg-emerald-500/15 p-2">
                  <PlusCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">စာရင်းအသစ်ထည့်ရန်</h2>
                  <p className="text-xs text-slate-400">ပြင်ဆင်မှုအသစ် မှတ်တမ်းတင်ပါ</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    ဖောက်သည်အမည်
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="ဥပမာ — ဦးကျော်မြင့်"
                    className="w-full rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    ရက်စွဲ
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="space-y-3">
                  {form.phones.map((phone, index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-xl border border-surface-600/80 bg-surface-800/40 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-sky-400">
                          ဖုန်း #{index + 1}
                        </span>
                        {form.phones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePhone(index)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            ဖယ်ရှားရန်
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">
                          ဖုန်းမော်ဒယ်
                        </label>
                        <input
                          type="text"
                          required
                          value={phone.phoneModel}
                          onChange={(e) => updatePhone(index, 'phoneModel', e.target.value)}
                          placeholder="ဥပမာ — iPhone 15 Pro"
                          className="w-full rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-400">
                          ပြဿနာ
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={phone.issue}
                          onChange={(e) => updatePhone(index, 'issue', e.target.value)}
                          placeholder="ဥပမာ — ဖန်သားကွဲ၊ ဘက်ထရီ မကြာခဏကုန်"
                          className="w-full resize-none rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addPhone}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-surface-600 bg-surface-800/40 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-300"
                  >
                    <PlusCircle className="h-4 w-4" />
                    ဖုန်းထပ်ထည့်ရန်
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      အစိတ်အပိုင်းကုန်ကျ
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.sparePartCost}
                      onChange={(e) => setForm({ ...form, sparePartCost: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400">
                      ဝန်ဆောင်ခ
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.serviceFee}
                      onChange={(e) => setForm({ ...form, serviceFee: e.target.value })}
                      placeholder="0"
                      className="w-full rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">
                    အခြေအနေ
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full cursor-pointer rounded-xl border border-surface-600 bg-surface-800/80 px-4 py-2.5 text-sm text-white outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {Object.entries(STATUS).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {previewPhones.length > 0 && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-emerald-400">
                      ထည့်သွင်းမည့်စာရင်း ({previewPhones.length} ခု)
                    </p>
                    <ul className="space-y-2">
                      {previewPhones.map((phone, index) => (
                        <li
                          key={index}
                          className="rounded-lg border border-surface-600/60 bg-surface-800/60 px-3 py-2 text-sm"
                        >
                          <p className="font-medium text-white">{phone.phoneModel}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{phone.issue}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={previewPhones.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  {previewPhones.length > 1
                    ? `စာရင်း ${previewPhones.length} ခု သွင်းမည်`
                    : 'စာရင်းသွင်းမည်'}
                </button>
              </form>
            </div>
          </section>
        </div>

        {/* Monthly Income Line Chart */}
        <section className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-surface-700/80 bg-surface-900/60 backdrop-blur-sm">
            <div className="flex flex-col gap-4 border-b border-surface-700/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/15 p-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">လအလိုက် ဝင်ငွေ</h2>
                  <p className="text-xs text-slate-400">Monthly Income Trends — ပြီးစီးသော အလုပ်များမှ</p>
                </div>
              </div>

              <div className="flex rounded-xl border border-surface-600 bg-surface-800/80 p-1">
                <button
                  type="button"
                  onClick={() => setChartView('monthly')}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                    chartView === 'monthly'
                      ? 'bg-emerald-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  လချုပ်
                </button>
                <button
                  type="button"
                  onClick={() => setChartView('yearly')}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                    chartView === 'yearly'
                      ? 'bg-violet-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  နှစ်ချုပ်
                </button>
              </div>
            </div>

            <div className="p-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243052" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                    formatter={(value) => <span className="text-slate-400">{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    name="ဝင်ငွေ"
                    stroke="#34d399"
                    strokeWidth={3}
                    dot={{ fill: '#34d399', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#6ee7b7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Analytics — breakdown charts */}
        <section className="mt-6">
          <div className="overflow-hidden rounded-2xl border border-surface-700/80 bg-surface-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-surface-700/80 px-6 py-4">
              <div className="rounded-lg bg-violet-500/15 p-2">
                <BarChart3 className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">လချုပ်နှင့် နှစ်ချုပ်စာရင်းများ</h2>
                <p className="text-xs text-slate-400">ဝင်ငွေနှင့် အမြတ်အစွန်း ခွဲခြမ်းစိတ်ဖြာမှု</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
              <div className="rounded-xl border border-surface-700/60 bg-surface-800/30 p-4">
                <h3 className="mb-4 text-sm font-medium text-slate-300">
                  {chartView === 'monthly' ? 'လစဉ် စုစုပေါင်းဝင်ငွေ' : 'နှစ်စဉ် စုစုပေါင်းဝင်ငွေ'}
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#243052" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="ဝင်ငွေ"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      fill="url(#incomeGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-surface-700/60 bg-surface-800/30 p-4">
                <h3 className="mb-4 text-sm font-medium text-slate-300">
                  {chartView === 'monthly' ? 'လစဉ် အမြတ်အစွန်း ခွဲခြမ်း' : 'နှစ်စဉ် အမြတ်အစွန်း ခွဲခြမ်း'}
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#243052" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                      formatter={(value) => (
                        <span className="text-slate-400">{value}</span>
                      )}
                    />
                    <Bar dataKey="spareParts" name="အစိတ်အပိုင်းရောင်းရ" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="service" name="ဝန်ဆောင်ခရရှိ" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-8 pb-4 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} {SHOP.name} — Myanmar Phone Repair Dashboard
        </footer>
      </div>
    </div>
  )
}

export default App
