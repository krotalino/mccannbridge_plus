import React from 'react';
import { REPORT_STATUSES } from '../../../data/reportsData';
import MiniSparkline from './MiniSparkline';

export default function ReportSummaryCards({ reports = [], activeStatusFilter, onStatusFilterChange }) {
  const total = reports.length;
  
  const toProcess = reports.filter(r => r.status === 'submitted' || r.status === 'qualified').length;
  const inProd = reports.filter(r => r.status === 'in_production' || r.status === 'needs_info').length;
  const internalReview = reports.filter(r => r.status === 'internal_review' || r.status === 'internal_fixes').length;
  const clientReview = reports.filter(r => r.status === 'client_review' || r.status === 'client_fixes').length;
  const approvedDelivered = reports.filter(r => r.status === 'approved' || r.status === 'delivered').length;
  
  // Late reports calculation
  const todayStr = new Date().toISOString().slice(0, 10);
  const lateReports = reports.filter(r => 
    r.status !== 'delivered' && 
    r.status !== 'cancelled' && 
    r.status !== 'approved' &&
    r.dueDate && r.dueDate < todayStr
  ).length;

  const urgentReports = reports.filter(r => r.priority === 'urgente' && r.status !== 'delivered' && r.status !== 'cancelled').length;
  const onTimeCount = reports.filter(r => r.status === 'delivered' || (r.dueDate && r.dueDate >= todayStr)).length;
  const slaRate = total > 0 ? Math.round((onTimeCount / total) * 100) : 100;

  const inProcessingTotal = inProd + internalReview + clientReview + toProcess;

  const statusPills = [
    {
      id: 'all',
      label: 'Toutes les demandes',
      count: total,
      badge: 'Total',
      color: '#FF7900'
    },
    {
      id: 'submitted',
      label: 'À qualifier',
      count: toProcess,
      badge: 'Assignation',
      color: '#2980B9'
    },
    {
      id: 'in_production',
      label: 'En production',
      count: inProd,
      badge: 'Analyste',
      color: '#FF7900'
    },
    {
      id: 'internal_review',
      label: 'Revue Interne (QA)',
      count: internalReview,
      badge: 'Lead QA',
      color: '#E65100'
    },
    {
      id: 'client_review',
      label: 'Validation Client',
      count: clientReview,
      badge: 'Orange CM',
      color: '#F39C12'
    },
    {
      id: 'delivered',
      label: 'Validés & Livrés',
      count: approvedDelivered,
      badge: 'Clôturés',
      color: '#27AE60'
    },
    {
      id: 'late',
      label: 'Alertes SLA',
      count: lateReports + (urgentReports > 0 ? ` (${urgentReports} urg.)` : ''),
      badge: 'Prioritaire',
      color: '#DC3545'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
      {/* ─── 4 KPI CARDS (Dashboard Analytics Style) ─── */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 14 
        }}
      >
        {/* KPI 1 : Total Demandes */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            background: '#FFF',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              DEMANDES & LIVRABLES
            </span>
            <span className="tag tag-orange" style={{ fontSize: 11 }}>
              📋 Registre
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--dark)' }}>
              {total}
            </div>
            <MiniSparkline data={[14, 18, 16, 22, 25, 24, total || 28]} color="#FF7900" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              ▲ +15.8%
            </span>
            <span style={{ color: 'var(--muted)' }}>volumes demandés T3</span>
          </div>
        </div>

        {/* KPI 2 : En Production & Revues */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            background: '#FFF',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              EN PRODUCTION & REVUE
            </span>
            <span className="tag tag-blue" style={{ fontSize: 11 }}>
              ⚡ Pipeline
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#2980B9' }}>
              {inProcessingTotal}
            </div>
            <MiniSparkline data={[8, 11, 9, 14, 12, 10, inProcessingTotal || 12]} color="#2980B9" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#2980B9', fontWeight: 700 }}>
              {clientReview} chez Orange
            </span>
            <span style={{ color: 'var(--muted)' }}>{inProd + internalReview} chez McCann</span>
          </div>
        </div>

        {/* KPI 3 : Validés & Livrés */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            background: '#FFF',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              RAPPORTS VALIDÉS & LIVRÉS
            </span>
            <span className="tag tag-green" style={{ fontSize: 11 }}>
              ✅ Certifiés
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#27AE60' }}>
              {approvedDelivered}
            </div>
            <MiniSparkline data={[5, 8, 12, 14, 18, 20, approvedDelivered || 22]} color="#27AE60" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: '#27AE60', fontWeight: 700 }}>
              {total > 0 ? Math.round((approvedDelivered / total) * 100) : 0}% taux clôture
            </span>
            <span style={{ color: 'var(--muted)' }}>bilans signés Orange</span>
          </div>
        </div>

        {/* KPI 4 : Respect SLA & Délais */}
        <div 
          className="card p-16" 
          style={{ 
            borderRadius: 12, 
            border: '1px solid #E0E0E0', 
            background: '#FFF',
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
              RESPECT SLA & DÉLAIS
            </span>
            <span className="tag" style={{ fontSize: 11, background: slaRate >= 85 ? '#E8F8F0' : '#FFF3E8', color: slaRate >= 85 ? '#27AE60' : '#E65100' }}>
              🎯 Ponctualité
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: slaRate >= 85 ? '#27AE60' : '#E65100' }}>
              {slaRate}%
            </div>
            <MiniSparkline data={[92, 94, 90, 96, 95, 98, slaRate || 95]} color={slaRate >= 85 ? '#27AE60' : '#E65100'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, paddingTop: 8, borderTop: '1px solid #F0F0F0' }}>
            <span style={{ color: slaRate >= 85 ? '#27AE60' : '#DC3545', fontWeight: 700 }}>
              {lateReports === 0 ? '✓ Aucun retard' : `⚠️ ${lateReports} alerte(s)`}
            </span>
            <span style={{ color: 'var(--muted)' }}>engagement contractuel</span>
          </div>
        </div>
      </div>

      {/* ─── WORKFLOW STATUS FILTER BAR (Dashboard Analytics Style) ─── */}
      <div 
        className="card"
        style={{
          background: '#FFF',
          borderRadius: 10,
          padding: '10px 14px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginRight: 4 }}>
          Filtrer par étape workflow :
        </span>
        
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statusPills.map(pill => {
            const isSelected = activeStatusFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => onStatusFilterChange(pill.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: isSelected ? '1px solid #FF7900' : '1px solid #E5E7EB',
                  background: isSelected ? '#FFF8F2' : '#FFFFFF',
                  color: isSelected ? '#FF7900' : '#374151',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 11.5,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{pill.label}</span>
                <span 
                  style={{
                    padding: '1px 6px',
                    borderRadius: 10,
                    background: isSelected ? '#FF7900' : '#F3F4F6',
                    color: isSelected ? '#FFFFFF' : '#6B7280',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                >
                  {pill.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
