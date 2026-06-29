'use client'
import { useState } from 'react'
import { User, Lock, Bell, Shield, Building2, Save } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { cn } from '@/utils'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'firm', label: 'Firm Details', icon: Building2 },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'compliance', label: 'Compliance', icon: Shield },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="flex flex-col flex-1">
      <DashboardHeader title="Settings" subtitle="Manage your account and firm preferences" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl flex gap-6">
          {/* Tab nav */}
          <div className="w-48 flex flex-col gap-1 flex-shrink-0">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all',
                  activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100')}>
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="card p-6 flex flex-col gap-5">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Personal Profile</h3>
                <div className="flex items-center gap-5 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold">
                    SA
                  </div>
                  <div>
                    <div className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Solomon Alemu, CPA</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Lead Auditor · ICPAE No. AU-2024-0042</div>
                    <button className="text-xs font-medium mt-2 px-3 py-1 rounded-lg border transition-colors hover:bg-gray-50"
                      style={{ borderColor: 'var(--border)', color: 'var(--brand-600)' }}>
                      Change photo
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Full name</label>
                    <input className="input-field" defaultValue="Solomon Alemu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Job title</label>
                    <input className="input-field" defaultValue="Lead Auditor" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Email</label>
                    <input className="input-field" defaultValue="solomon@auditpro.et" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Phone</label>
                    <input className="input-field" defaultValue="+251 911 000 000" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Professional license number</label>
                    <input className="input-field" defaultValue="AU-2024-0042" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary flex items-center gap-2"><Save size={15} /> Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'firm' && (
              <div className="card p-6 flex flex-col gap-5">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Firm Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[['Firm name', 'AuditPro'], ['Trading name', 'AuditPro'], ['ICPAE member no.', 'ICPAE-ET-2009-0042'], ['TIN number', '0123456789'], ['Address', 'Bole Road, Kirkos Sub-city'], ['City', 'Addis Ababa']].map(([label, val]) => (
                    <div key={label} className={label === 'Address' ? 'col-span-2' : ''}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{label}</label>
                      <input className="input-field" defaultValue={val} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary flex items-center gap-2"><Save size={15} /> Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="card p-6 flex flex-col gap-5">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Security Settings</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Current password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>New password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>Confirm new password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                </div>
                <div className="rounded-xl p-4 border" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Adds an extra layer of security to your account</div>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-green-500 relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="btn-primary flex items-center gap-2"><Save size={15} /> Update Password</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card p-6 flex flex-col gap-4">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
                {[
                  ['Document uploaded by client', true],
                  ['New message received', true],
                  ['Invoice paid', true],
                  ['Invoice overdue', true],
                  ['Deadline approaching (7 days)', true],
                  ['Engagement status changed', false],
                  ['New client registered', false],
                ].map(([label, enabled]) => (
                  <div key={label as string} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label as string}</span>
                    <div className={cn('w-11 h-6 rounded-full relative cursor-pointer transition-colors', enabled ? 'bg-blue-500' : 'bg-gray-300')}>
                      <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', enabled ? 'right-0.5' : 'left-0.5')} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="card p-6 flex flex-col gap-5">
                <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Compliance & Credentials</h3>
                <div className="grid gap-4">
                  {[
                    { label: 'ICPAE Membership', value: 'Active', expires: '31 Dec 2024', status: 'valid' },
                    { label: 'IFRS Certification', value: 'Certified', expires: '30 Jun 2025', status: 'valid' },
                    { label: 'CPD Hours (2024)', value: '24 / 40 hours', expires: 'Target: 40h', status: 'warning' },
                    { label: 'Professional Indemnity Insurance', value: 'Active', expires: '31 Mar 2025', status: 'valid' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border"
                      style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Expires: {item.expires}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{item.value}</span>
                        <span className={cn('w-2.5 h-2.5 rounded-full', item.status === 'valid' ? 'bg-green-500' : 'bg-amber-500')} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
