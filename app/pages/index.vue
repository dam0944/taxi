<script setup>
definePageMeta({ middleware: "auth" });
useHead({ title: "Cambodia Fleet Overview | moovit Taxi" });
const period = ref("Monthly");
const roleFilter = ref("All roles");
const showFilters = ref(false);
const showDetails = ref(false);
const prompt = ref("");
const answer = ref("");
const workflowForm = ref(false);
const workflowName = ref("");
const selectedRoles = ref([]);
const allSelected = computed({
  get: () =>
    visibleRoles.value.length > 0 &&
    visibleRoles.value.every((role) => selectedRoles.value.includes(role.name)),
  set: (checked) => {
    selectedRoles.value = checked ? visibleRoles.value.map((role) => role.name) : [];
  },
});
const workflows = ref(["Daily vehicle readiness check"]);
const roles = [
  {
    name: "Fleet Manager",
    focus: "Fleet Operations",
    metrics: "Trip Revenue, Vehicle Availability, Fleet Utilization",
    active: true,
  },
  {
    name: "Finance Manager",
    focus: "Fares & Payments",
    metrics: "Fare Collection, Driver Payouts, Trip Revenue",
    active: false,
  },
  {
    name: "Dispatcher",
    focus: "Bookings & Dispatch",
    metrics: "Pending Bookings, Driver Assignments, Pickup Times",
    active: true,
  },
  {
    name: "Driver Supervisor",
    focus: "Drivers & Vehicle Tracking",
    metrics: "Driver Availability, Trip Status, Vehicle Locations",
    active: true,
  },
];
const visibleRoles = computed(() =>
  roles.filter(
    (role) =>
      roleFilter.value === "All roles" ||
      (roleFilter.value === "Active" ? role.active : !role.active)
  )
);
const value = computed(
  () =>
    ({ Monthly: "USD 8,400.00", Quarterly: "USD 25,200.00", Yearly: "USD 100,800.00" }[
      period.value
    ])
);
function ask(question = prompt.value) {
  if (!question.trim()) return;
  prompt.value = question;
  answer.value = `Based on this sample dashboard, the fleet performance score is 87/100 and projected ${period.value.toLowerCase()} trip revenue is ${
    value.value
  }. Review driver availability, pending bookings, and fleet tasks first. Connect live booking and vehicle tracking data for a detailed analysis of “${question}”.`;
}
function exportReport() {
  const csv = [
    "Role,Operational Focus,Metrics,Status",
    ...visibleRoles.value.map(
      (r) =>
        `"${r.name}","${r.focus}","${r.metrics}","${r.active ? "Active" : "Not Active"}"`
    ),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "cambodia-taxi-fleet-overview.csv";
  link.click();
  URL.revokeObjectURL(url);
}
function addWorkflow() {
  if (workflowName.value.trim()) {
    workflows.value.push(workflowName.value.trim());
    workflowName.value = "";
    workflowForm.value = false;
  }
}
</script>
<template>
  <section class="welcome-row">
    <div>
      <h1>Welcome back, Fleet Administrator!</h1>
      <p>Manage taxi bookings, track vehicles, and coordinate drivers across Cambodia.</p>
    </div>
    <div class="page-actions">
      <button
        class="pill"
        :aria-expanded="showFilters"
        @click="showFilters = !showFilters"
      >
        <UiDashboardIcon name="filter" />Filters</button
      ><button class="pill" @click="exportReport">
        <UiDashboardIcon name="export" />Exports</button
      ><button
        class="pill primary"
        @click="ask('How can I improve taxi bookings and fleet operations?')"
      >
        <UiDashboardIcon name="spark" />Analyze with AI
      </button>
    </div>
  </section>
  <div v-if="showFilters" class="filter-panel">
    <label
      >Role status
      <select v-model="roleFilter">
        <option>All roles</option>
        <option>Active</option>
        <option>Not Active</option>
      </select></label
    ><label
      >Reporting period
      <select v-model="period">
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Yearly</option>
      </select></label
    ><span class="sample-label">Sample data</span>
  </div>
  <section class="dashboard-grid" aria-label="Cambodia taxi fleet overview">
    <article class="dashboard-card health-card">
      <div class="card-heading">
        <h2>Fleet Performance Score</h2>
        <button
          aria-label="Show fleet performance details"
          @click="showDetails = !showDetails"
        >
          <UiDashboardIcon name="more" />
        </button>
      </div>
      <div class="gauge">
        <svg
          viewBox="0 0 420 275"
          role="img"
          aria-label="Sample fleet performance score 87 out of 100, healthy"
        >
          <defs>
            <linearGradient id="gaugeColor">
              <stop stop-color="var(--brand-mint)" />
              <stop offset=".55" stop-color="var(--brand-highlight)" />
              <stop offset="1" stop-color="var(--brand-primary)" />
            </linearGradient>
            <filter id="gaugeBlur"><feGaussianBlur stdDeviation="15" /></filter>
          </defs>
          <path
            d="M45 228 A165 165 0 0 1 375 228"
            stroke="url(#gaugeColor)"
            stroke-width="58"
            fill="none"
            filter="url(#gaugeBlur)"
            opacity=".8"
          />
          <path
            d="M45 228 A165 165 0 0 1 375 228"
            stroke="#fff"
            stroke-width="1.3"
            fill="none"
          />
          <g fill="currentColor" font-size="11" text-anchor="middle" opacity=".65">
            <text x="73" y="221">20</text>
            <text x="91" y="180">30</text>
            <text x="118" y="143">40</text>
            <text x="153" y="117">50</text>
            <text x="204" y="107">60</text>
            <text x="258" y="117">70</text>
            <text x="299" y="143">80</text>
            <text x="328" y="180">90</text>
            <text x="344" y="221">100</text>
          </g>
          <g fill="currentColor" font-size="8" font-weight="600">
            <text x="194" y="53">STABLE</text>
            <text transform="translate(30 178) rotate(-72)">AT RISK</text>
            <text transform="translate(391 151) rotate(72)">HEALTHY</text>
          </g>
          <circle
            cx="347"
            cy="145"
            r="6"
            fill="var(--brand-forest)"
            stroke="white"
            stroke-width="2"
          />
        </svg>
        <div class="gauge-value">
          <strong>87<span>/100</span></strong>
          <p><b>HEALTHY</b> last month's fleet performance</p>
        </div>
      </div>
      <div v-if="showDetails" class="health-details">
        Trip revenue +18% · On-time pickups 92% · Fleet utilization 84%
      </div>
      <button
        class="details-button"
        :aria-expanded="showDetails"
        @click="showDetails = !showDetails"
      >
        {{ showDetails ? "Hide Details" : "View Details" }}
      </button>
    </article>
    <article class="dashboard-card analytics-card">
      <div class="card-heading">
        <h2>Trip Revenue Forecast</h2>
        <select v-model="period" aria-label="Analytics reporting period">
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
        </select>
      </div>
      <div class="main-value">
        <p>Projected Trip Revenue</p>
        <strong>{{ value }}</strong>
      </div>
      <p class="analytics-description">
        Sample trip revenue forecast for your Cambodia fleet. Amounts are shown in USD.
      </p>
      <div class="metrics">
        <div
          v-for="(metric, index) in [
            { label: 'Forecast Accuracy', value: '96%' },
            { label: 'Trip Revenue Growth', value: '+18%' },
            { label: 'AI Confidence Score', value: 'High' },
          ]"
          :key="metric.label"
          class="metric"
          :class="{ highlighted: index === 0 }"
        >
          <span class="metric-dot" /><small>{{ metric.label }}</small
          ><strong>{{ metric.value }}</strong
          ><span>vs last month</span>
          <div class="metric-bar" />
        </div>
      </div>
    </article>
    <article class="dashboard-card assistant-card">
      <div class="ai-orb" />
      <h2>How can I help with your bookings<br />and fleet today?</h2>
      <div v-if="answer" class="assistant-answer" role="status">{{ answer }}</div>
      <div class="assistant-bottom">
        <div class="suggestions">
          <button
            v-for="question in [
              'Any pending bookings?',
              'Which drivers are available?',
              'Trip revenue forecast?',
            ]"
            :key="question"
            @click="ask(question)"
          >
            {{ question }}
          </button>
        </div>
        <form class="prompt-box" @submit.prevent="ask()">
          <textarea
            v-model="prompt"
            aria-label="Ask the fleet assistant"
            placeholder="Ask about bookings, drivers, or trips..."
          />
          <div class="prompt-tools">
            <span class="assistant-hint">Preview assistant</span
            ><UiDashboardIcon name="globe" /><button
              class="send-button"
              type="submit"
              aria-label="Send question"
            >
              <UiDashboardIcon name="send" />
            </button>
          </div>
        </form>
      </div>
    </article>
  </section>
  <section class="lower-grid">
    <article class="roles-section">
      <div class="section-heading">
        <h2>Fleet Team Responsibilities</h2>
        <div class="table-actions">
          <button class="square-button" aria-label="Download roles" @click="exportReport">
            <UiDashboardIcon name="download" /></button
          ><select v-model="roleFilter" aria-label="Filter roles">
            <option>All roles</option>
            <option>Active</option>
            <option>Not Active</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="allSelected"
                  aria-label="Select all roles"
                />Team Role
              </th>
              <th>Operational Focus</th>
              <th>Priority Metrics</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in visibleRoles" :key="role.name">
              <td>
                <input
                  type="checkbox"
                  v-model="selectedRoles"
                  :value="role.name"
                  :aria-label="`Select ${role.name}`"
                />{{ role.name }}
              </td>
              <td>{{ role.focus }}</td>
              <td class="muted">{{ role.metrics }}</td>
              <td>
                <span class="status" :class="{ active: role.active }">{{
                  role.active ? "Active" : "Not Active"
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="table-caption">
        Sample data · Booking, tracking, and dispatch responsibilities.<span
          >{{ visibleRoles.length }} roles</span
        >
      </p>
    </article>
    <article class="workflow-section">
      <div class="section-heading">
        <h2>Fleet Operations Tasks</h2>
        <button
          class="pill"
          :aria-expanded="workflowForm"
          @click="workflowForm = !workflowForm"
        >
          <UiDashboardIcon name="plus" />Add Task
        </button>
      </div>
      <form v-if="workflowForm" class="workflow-form" @submit.prevent="addWorkflow">
        <input
          v-model="workflowName"
          aria-label="Fleet task name"
          placeholder="Fleet task name"
          required
        /><button class="pill primary">Add</button>
      </form>
      <dl class="workflow-meta">
        <dt><UiDashboardIcon name="users" />Assigned to</dt>
        <dd>
          <div class="avatar-stack"><span>JL</span><span>AM</span><span>+3</span></div>
        </dd>
        <dt><UiDashboardIcon name="calendar" />Due Date</dt>
        <dd>Sample schedule</dd>
        <dt><UiDashboardIcon name="check" />Priority</dt>
        <dd><span class="priority">High</span></dd>
      </dl>
      <p class="workflow-description">
        Organize vehicle checks, driver coordination, and booking follow-ups.
      </p>
      <div v-for="(workflow, index) in workflows" :key="index" class="workflow-item">
        <div>
          <span class="workflow-indicator" /><strong>{{ workflow }}</strong
          ><span class="workflow-progress">{{ index === 0 ? "68%" : "0%" }}</span>
        </div>
        <div class="progress-track">
          <span :style="{ width: index === 0 ? '68%' : '0%' }" />
        </div>
      </div>
    </article>
  </section>
</template>
