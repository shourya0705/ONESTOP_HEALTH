import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, FileText, 
  ShieldAlert, X, Terminal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  isSummary?: boolean;
  toolCall?: string;
}

export const AIAssistant: React.FC = () => {
  const { aiDrawerOpen, setAiDrawerOpen, currentPatient, records, prescriptions, doctors } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${currentPatient.name}! I am **ONESTOP AI**, your personal health intelligence assistant. I can query your authorized medical records, summarize your health history, or help you find specialized doctors. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!aiDrawerOpen) return null;

  // Process user query against records or general guidance
  const processQuery = (queryText: string) => {
    const lower = queryText.toLowerCase();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      let sources: string[] = [];
      let toolCall = "";

      // 1. Vaccination query
      if (lower.includes('vaccin') || lower.includes('immuniz')) {
        toolCall = "ledger.query_vaccination_records(citizen_health_id)";
        const vacs = records.filter(r => r.type === 'VACCINATION');
        if (vacs.length > 0) {
          responseText = `You have **${vacs.length} vaccination record(s)** linked to your Health ID (${currentPatient.healthId}):\n\n` +
            vacs.map(v => `• **${v.title}** on ${v.date} at ${v.hospital} (${v.details?.dose || 'Dose 1'})`).join('\n') +
            `\n\nYour latest recorded vaccination was **${vacs[vacs.length - 1].title}** on **${vacs[vacs.length - 1].date}**.`;
          sources = vacs.map(v => `${v.title} (${v.date})`);
        } else {
          responseText = `No vaccination records were found in your Health ID database.`;
        }
      }
      // 2. Medication / Prescription query
      else if (lower.includes('medicin') || lower.includes('drug') || lower.includes('prescription') || lower.includes('taking')) {
        toolCall = "ledger.query_active_prescriptions(citizen_id)";
        const activeMeds = prescriptions.filter(p => p.patientId === currentPatient.id);
        const medRecords = records.filter(r => r.type === 'MEDICATION' || r.type === 'CONSULTATION');
        
        if (activeMeds.length > 0 || medRecords.length > 0) {
          let medListText = "";
          activeMeds.forEach(rx => {
            rx.medicines.forEach(m => {
              medListText += `• **${m.name}** (${m.dosage}) — {${m.frequency}}, ${m.timing} (Prescribed by ${rx.doctorName})\n`;
            });
          });

          responseText = `Based on your authorized digital prescriptions and medical records, your active medications include:\n\n` +
            (medListText || `• Budecort Inhaler 200mcg (2 Puffs, twice daily)\n• Montair LC 10mg (1 Tablet at night)`) +
            `\n\n*Always follow the prescribed timing and instructions specified by your consulting physician.*`;
          sources = activeMeds.map(p => `Prescription #${p.id} by ${p.doctorName}`);
        } else {
          responseText = `You currently have no active recorded prescriptions.`;
        }
      }
      // 3. Surgery / Operation query
      else if (lower.includes('surger') || lower.includes('operat') || lower.includes('appendec')) {
        toolCall = "ledger.query_surgical_history(citizen_id)";
        const surgeries = records.filter(r => r.type === 'SURGERY');
        if (surgeries.length > 0) {
          const surg = surgeries[0];
          responseText = `According to your Health ID records, your most recent procedure was:\n\n` +
            `• **${surg.title}** on **${surg.date}** at **${surg.hospital}**.\n` +
            `• **Surgeon**: ${surg.details?.surgeon || surg.doctorName}\n` +
            `• **Outcome**: ${surg.details?.outcome || surg.description}`;
          sources = [`Surgery Record #${surg.id} (${surg.date})`];
        } else {
          responseText = `No past surgical procedures are recorded in your Health ID profile.`;
        }
      }
      // 4. Doctor Finder / Specialty Search
      else if (lower.includes('doctor') || lower.includes('find') || lower.includes('cardiolog') || lower.includes('derma') || lower.includes('special')) {
        toolCall = "directory.search_specialists(specialty)";
        let requestedSpecialty = "General Physician";
        if (lower.includes('cardio') || lower.includes('heart')) requestedSpecialty = "Cardiology";
        if (lower.includes('derma') || lower.includes('skin')) requestedSpecialty = "Dermatology";
        if (lower.includes('ortho') || lower.includes('bone')) requestedSpecialty = "Orthopedics";

        const matchingDocs = doctors.filter(d => d.specialty.toLowerCase().includes(requestedSpecialty.toLowerCase()) || d.verificationStatus === 'VERIFIED');
        
        responseText = `Here are verified healthcare specialists available in the ONESTOP HEALTH network for **${requestedSpecialty}**:\n\n` +
          matchingDocs.map(d => `• **${d.name}** (${d.specialty})\n  Hospital: ${d.hospital} | Status: Verified (${d.licenseNumber})`).join('\n\n') +
          `\n\nYou can request an appointment or share your Health ID with them directly through the Doctor Portal.`;
      }
      // 5. Symptom / General Guidance
      else if (lower.includes('headache') || lower.includes('fever') || lower.includes('cough') || lower.includes('pain') || lower.includes('symptom')) {
        toolCall = "guideline.analyze_symptoms(symptom_list)";
        responseText = `### General Educational Information on Symptoms:\n\n` +
          `• **Common Causes**: Mild fatigue, stress, dehydration, seasonal viral infections, or allergy flare-ups.\n` +
          `• **Self-Care Guidance**: Rest adequately, stay hydrated, and monitor your body temperature.\n` +
          `• **Warning Signs to Watch For**: Sudden high fever (>102°F), difficulty breathing, severe chest pain, persistent vomiting, or sudden neurological changes.\n\n` +
          `⚠️ *IMPORTANT MEDICAL DISCLAIMER*: This information is for general educational purposes and does not replace advice from a qualified healthcare professional. If your symptoms worsen or persist, please consult a verified doctor immediately.`;
      }
      // Default help response
      else {
        responseText = `I searched your Health ID records for "${queryText}".\n\n` +
          `You currently have **${records.length} records** on your timeline including vaccinations, consultations, surgeries, and lab results. You can ask me:\n` +
          `• *"What vaccinations have I received?"*\n` +
          `• *"What medications am I taking?"*\n` +
          `• *"When was my last surgery?"*\n` +
          `• *"Find a cardiologist for me."*`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources,
        toolCall
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Summarize Complete Medical History
  const handleSummarizeHistory = () => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: 'Summarize My Medical History',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const summaryText = `### 📋 OFFICIAL MEDICAL HISTORY EXECUTIVE SUMMARY\n` +
        `**Citizen**: ${currentPatient.name} | **Health ID**: ${currentPatient.healthId}\n` +
        `**Blood Group**: ${currentPatient.bloodGroup} | **DOB**: ${currentPatient.dob}\n\n` +
        `---\n\n` +
        `**1. Chronic Conditions & Alerts**:\n` +
        `• Conditions: ${currentPatient.criticalConditions.join(', ')}\n` +
        `• Allergies: ${currentPatient.allergies.join(', ')} (STRICT CONTRAINDICATION)\n\n` +
        `**2. Surgical & Operative History**:\n` +
        records.filter(r => r.type === 'SURGERY').map(s => `• ${s.date}: ${s.title} at ${s.hospital} (${s.details?.surgeon || s.doctorName})`).join('\n') + `\n\n` +
        `**3. Active Medications**:\n` +
        prescriptions.flatMap(p => p.medicines).map(m => `• ${m.name} ${m.dosage} - ${m.frequency}`).join('\n') + `\n\n` +
        `**4. Recent Consultations & Diagnostics**:\n` +
        records.filter(r => r.type === 'CONSULTATION' || r.type === 'LAB_TEST').map(r => `• ${r.date}: ${r.title} (${r.doctorName})`).join('\n') + `\n\n` +
        `*Generated by ONESTOP AI Health Engine. Verified against national health ledger.*`;

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: summaryText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSummary: true,
        toolCall: "ledger.summarize_lifetime_history(citizen_id)"
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white text-slate-900 shadow-2xl border-l border-slate-200 flex flex-col animate-slideLeft">
      
      {/* AI Header */}
      <div className="p-4 bg-medical-950 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-300/30 flex items-center justify-center text-teal-200 shadow-sm">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white tracking-wide">ONESTOP AI</h3>
              <span className="bg-teal-400/20 text-teal-100 text-[10px] font-mono px-2 py-0.5 rounded-full border border-teal-300/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-xs text-teal-100/90 font-medium">Health Record AI Navigator</p>
          </div>
        </div>

        <button 
          onClick={() => setAiDrawerOpen(false)}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Pills */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
        <button 
          onClick={handleSummarizeHistory}
          className="shrink-0 bg-medical-50 hover:bg-medical-100 text-medical-800 border border-medical-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-medical-600" />
          <span>Summarize History</span>
        </button>

        <button 
          onClick={() => processQuery('What medications am I currently taking?')}
          className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-full font-medium transition-colors shadow-xs"
        >
          💊 Current Meds
        </button>

        <button 
          onClick={() => processQuery('Find a cardiologist')}
          className="shrink-0 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-full font-medium transition-colors shadow-xs"
        >
          🩺 Find Specialist
        </button>
      </div>

      {/* Chat Conversation Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-medical-500 text-white rounded-br-none shadow-soft font-medium'
                : msg.isSummary
                ? 'bg-white border border-teal-200 text-slate-800 rounded-bl-none shadow-elevated font-mono'
                : 'bg-white/95 backdrop-blur-xs text-slate-800 rounded-bl-none border border-slate-200/80 shadow-soft'
            }`}>
              {/* Optional monospaced API tool call chip */}
              {msg.toolCall && (
                <div className="mb-2 text-[10px] font-mono bg-slate-900 text-teal-300 px-2.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 w-fit">
                  <Terminal className="w-3.5 h-3.5 text-teal-400" />
                  <span>API Tool: {msg.toolCall}</span>
                </div>
              )}

              <div className="whitespace-pre-line leading-relaxed">
                {msg.text}
              </div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-teal-700">
                  <span className="font-bold block mb-0.5">Verified Data Sources:</span>
                  {msg.sources.map((s, idx) => (
                    <span key={idx} className="inline-block bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 mr-1 mt-1 font-mono text-[9px]">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <span className="text-[9px] opacity-60 mt-1.5 block text-right">
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-350 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2.5 items-center text-slate-500 text-xs italic">
            <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <span>ONESTOP AI is analyzing authorized health records...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Safety Legal Disclaimer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-start gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <p>
          ⚠️ <strong>Safety Disclaimer:</strong> AI guidance is not medical advice. Always consult a qualified physician for healthcare decisions.
        </p>
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) processQuery(input);
        }}
        className="p-3 bg-white border-t border-slate-200 flex gap-2"
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ONESTOP AI about records or symptoms..." 
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-medical-700 hover:bg-medical-800 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
