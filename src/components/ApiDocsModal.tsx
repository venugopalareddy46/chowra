/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * API Documentation & Interactive Explorer (/docs)
 * Lead System Architect: Chowra Engineering Team
 */

import React, { useState } from 'react';
import { 
  X, BookOpen, Terminal, Play, Copy, Check, 
  ExternalLink, ShieldCheck, Clock, ArrowRight, Code2 
} from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  parameters?: Array<{ name: string; type: string; required: boolean; description: string; defaultVal?: string }>;
  requestBodySample?: string;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'ep-health',
    method: 'GET',
    path: '/health',
    summary: 'Service Health & Telemetry Status',
    description: 'Returns real-time operational status, memory metrics, and GPS socket telemetry.',
  },
  {
    id: 'ep-shipment',
    method: 'GET',
    path: '/api/v1/shipments/{awb}',
    summary: 'Consignment Milestones & Telemetry',
    description: 'Retrieves complete checkpoint chain of custody, weight, carrier, and destination hub for a given AWB.',
    parameters: [
      { name: 'awb', type: 'string', required: true, description: 'Air Waybill number (e.g. CHW-8942-IN)', defaultVal: 'CHW-8942-IN' }
    ]
  },
  {
    id: 'ep-hubs',
    method: 'GET',
    path: '/api/v1/hubs',
    summary: 'Air Cargo Super-Hub Network',
    description: 'Returns all 10 strategic multimodal super-hubs, daily tonnages, customs status, and direct lanes.',
  },
  {
    id: 'ep-book',
    method: 'POST',
    path: '/api/v1/shipments/book',
    summary: 'Schedule Doorstep Pickup & Dispatch',
    description: 'Registers an electronic consignment manifest, assigns an express courier van, and generates an AWB.',
    requestBodySample: JSON.stringify({
      senderName: "Apex Precision Engineering Ltd.",
      senderPhone: "+91 98200 44810",
      pickupAddress: "Plot 42, Marol Industrial Area, Andheri East, Mumbai",
      pickupCity: "Mumbai",
      recipientCity: "New Delhi",
      serviceSpeed: "Chowra Air Express Next-Day",
      estimatedWeightKg: 18.5,
      packageCount: 2
    }, null, 2)
  }
];

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeEndpointId, setActiveEndpointId] = useState<string>('ep-health');
  const [paramValues, setParamValues] = useState<Record<string, string>>({ awb: 'CHW-8942-IN' });
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[3].requestBodySample || '');
  const [responseOutput, setResponseOutput] = useState<{ status: number; durationMs: number; data: any } | null>(null);
  const [executing, setExecuting] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const currentEp = ENDPOINTS.find((e) => e.id === activeEndpointId) || ENDPOINTS[0];

  const handleExecute = async () => {
    setExecuting(true);
    setResponseOutput(null);

    try {
      let url = currentEp.path;
      if (currentEp.parameters) {
        currentEp.parameters.forEach((p) => {
          const val = paramValues[p.name] || p.defaultVal || '';
          url = url.replace(`{${p.name}}`, val);
        });
      }

      if (currentEp.method === 'GET') {
        const res = await apiClient.get(url);
        setResponseOutput({ status: res.status, durationMs: res.durationMs, data: res.data });
      } else {
        const res = await apiClient.post(url, requestBody);
        setResponseOutput({ status: res.status, durationMs: res.durationMs, data: res.data });
      }
    } catch (err: any) {
      setResponseOutput({
        status: 500,
        durationMs: 40,
        data: { error: err.message || 'Execution failed' },
      });
    } finally {
      setExecuting(false);
    }
  };

  const getCurlCommand = () => {
    let url = `https://api.chowralogistics.example${currentEp.path}`;
    if (currentEp.parameters) {
      currentEp.parameters.forEach((p) => {
        url = url.replace(`{${p.name}}`, paramValues[p.name] || p.defaultVal || '');
      });
    }

    if (currentEp.method === 'GET') {
      return `curl -X GET "${url}" \\\n  -H "Accept: application/json" \\\n  -H "X-API-Key: chowra_sec_live_9942"`;
    }
    return `curl -X POST "${url}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: chowra_sec_live_9942" \\\n  -d '${requestBody.replace(/\n/g, '')}'`;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient */}
        <div 
          className="h-1.5 w-full shrink-0" 
          style={{ background: 'linear-gradient(90deg, #008793 0%, #00bf72 50%, #a8eb12 100%)' }} 
        />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-slate-950 shadow-md shrink-0"
              style={{ background: 'linear-gradient(135deg, #008793, #00bf72)' }}
            >
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-display font-extrabold text-white">
                  Chowra REST API Documentation (/docs)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-data font-bold">
                  v2.4.0 OAS 3.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-data">
                OpenAPI Spec & Interactive Test Console · Architect: Chowra Engineering Team
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 2-Column Explorer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Endpoints Menu */}
          <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-3 sm:p-4 overflow-y-auto space-y-2 shrink-0">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 font-data">
              Logistics API Endpoints
            </div>

            {ENDPOINTS.map((ep) => {
              const isSelected = ep.id === activeEndpointId;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => {
                    setActiveEndpointId(ep.id);
                    setResponseOutput(null);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-amber-400 text-white shadow-xs'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded font-data ${
                      ep.method === 'GET' ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-data font-bold text-xs truncate text-white">
                      {ep.path}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {ep.summary}
                  </div>
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 px-2 space-y-1">
              <div>Base URL: <code className="text-slate-300 font-data">/api/v1</code></div>
              <div>Auth: <code className="text-slate-300 font-data">Bearer & API-Key</code></div>
            </div>
          </div>

          {/* Right Column: Interactive Console & Test Runner */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Endpoint Header Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded font-data ${
                  currentEp.method === 'GET' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {currentEp.method}
                </span>
                <span className="font-data font-bold text-sm sm:text-base text-white">
                  {currentEp.path}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentEp.description}
              </p>
            </div>

            {/* Parameters section */}
            {currentEp.parameters && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-data">
                  Path Parameters
                </h4>
                <div className="space-y-2">
                  {currentEp.parameters.map((p) => (
                    <div key={p.name} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-data font-bold text-xs text-amber-300">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-data ml-1.5">({p.type}, {p.required ? 'required' : 'optional'})</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.description}</p>
                      </div>
                      <input
                        type="text"
                        value={paramValues[p.name] || p.defaultVal || ''}
                        onChange={(e) => setParamValues({ ...paramValues, [p.name]: e.target.value })}
                        placeholder={`e.g. ${p.defaultVal || p.name}`}
                        className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-data focus:outline-none focus:border-amber-400 w-full sm:w-48 placeholder-slate-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Request Body sample for POST */}
            {currentEp.method === 'POST' && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-data">
                  JSON Request Body
                </h4>
                <textarea
                  rows={6}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Enter JSON request payload (e.g. { ... })..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-data text-xs text-slate-200 focus:outline-none focus:border-amber-400 placeholder-slate-600"
                />
              </div>
            )}

            {/* Actions: Try It Out & Copy cURL */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExecute}
                disabled={executing}
                className="py-2.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{executing ? 'Executing API Call...' : 'Try It Out (Send Request)'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCurl}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'cURL Copied' : 'Copy cURL'}</span>
              </button>
            </div>

            {/* Response Console Output */}
            {responseOutput && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-data">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Response Status:</span>
                    <span className="font-bold text-[#a8eb12] px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40">
                      HTTP {responseOutput.status} OK
                    </span>
                  </div>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Latency: {responseOutput.durationMs} ms</span>
                  </span>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 font-data overflow-x-auto max-h-60 leading-relaxed shadow-inner">
                  {JSON.stringify(responseOutput.data, null, 2)}
                </pre>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0 font-data">
          <span>Enterprise Gateway · SLA 99.99%</span>
          <span className="text-slate-500">Chowra Logistics API Engine · Chowra Engineering Team</span>
        </div>

      </div>
    </div>
  );
};
