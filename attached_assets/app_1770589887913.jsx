const { useState, useEffect, useRef } = React;

// Initial data structure
const initialClients = [
    {
        id: 1,
        name: "Viveur",
        site: "https://viveur-liege.replit.app/",
        secteur: "Horeca",
        status: "lead",
        source: "Out",
        contacted: true,
        called: false,
        sold: false,
        montant: 0,
        abonnement: 0,
        coutReplit: 15.68,
        coutDomaine: 0,
        autresCouts: 0,
        notes: "",
        dateAdded: new Date().toISOString()
    }
];

function App() {
    const [clients, setClients] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [toast, setToast] = useState(null);
    const [coutMeta, setCoutMeta] = useState(100);
    const [coutDone, setCoutDone] = useState(90.47);

    // Load data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('donecrm-clients');
        if (saved) {
            setClients(JSON.parse(saved));
        } else {
            setClients(initialClients);
        }
        
        const savedCouts = localStorage.getItem('donecrm-couts');
        if (savedCouts) {
            const { meta, done } = JSON.parse(savedCouts);
            setCoutMeta(meta);
            setCoutDone(done);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (clients.length > 0) {
            localStorage.setItem('donecrm-clients', JSON.stringify(clients));
        }
    }, [clients]);

    useEffect(() => {
        localStorage.setItem('donecrm-couts', JSON.stringify({ meta: coutMeta, done: coutDone }));
    }, [coutMeta, coutDone]);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // Calculate metrics
    const metrics = {
        totalVentes: clients.reduce((sum, c) => sum + (c.montant || 0), 0),
        totalAbonnements: clients.reduce((sum, c) => sum + (c.abonnement || 0), 0),
        totalCoutsReplit: clients.reduce((sum, c) => sum + (c.coutReplit || 0), 0),
        totalCoutsDomaine: clients.reduce((sum, c) => sum + (c.coutDomaine || 0), 0),
        totalAutresCouts: clients.reduce((sum, c) => sum + (c.autresCouts || 0), 0),
        nbrClients: clients.filter(c => c.status === 'client').length,
        nbrLeads: clients.filter(c => c.status === 'lead').length,
        nbrProspects: clients.filter(c => c.status === 'prospect').length,
    };

    metrics.mrr = metrics.totalAbonnements;
    metrics.arr = metrics.mrr * 12;
    metrics.totalCouts = coutMeta + coutDone + metrics.totalCoutsReplit + metrics.totalCoutsDomaine + metrics.totalAutresCouts;
    metrics.marge = metrics.totalVentes - metrics.totalCouts;

    const addClient = (clientData) => {
        if (editingClient) {
            setClients(clients.map(c => c.id === editingClient.id ? { ...clientData, id: c.id } : c));
            showToast('Client mis à jour !');
        } else {
            const newClient = {
                ...clientData,
                id: Date.now(),
                dateAdded: new Date().toISOString()
            };
            setClients([...clients, newClient]);
            showToast('Client ajouté !');
        }
        setShowModal(false);
        setEditingClient(null);
    };

    const deleteClient = (id) => {
        if (confirm('Supprimer ce client ?')) {
            setClients(clients.filter(c => c.id !== id));
            showToast('Client supprimé !');
        }
    };

    const updateClientStatus = (clientId, newStatus) => {
        setClients(clients.map(c => 
            c.id === clientId ? { ...c, status: newStatus } : c
        ));
        showToast('Statut mis à jour !');
    };

    const importExcel = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            const imported = [];
            for (let i = 7; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (row[1] && row[1] !== 'Etablissement') {
                    const parseFormula = (val) => {
                        if (!val) return 0;
                        if (typeof val === 'number') return val;
                        if (typeof val === 'string' && val.startsWith('=')) {
                            const match = val.match(/(\d+\.?\d*)/);
                            return match ? parseFloat(match[1]) : 0;
                        }
                        return 0;
                    };

                    imported.push({
                        id: Date.now() + i,
                        name: row[1] || '',
                        site: row[2] || '',
                        secteur: row[3] || '',
                        source: row[4] || '',
                        contacted: row[5] === 1,
                        called: row[6] === 1,
                        sold: row[7] === 1,
                        montant: parseFormula(row[8]),
                        abonnement: parseFormula(row[9]),
                        coutReplit: parseFormula(row[10]),
                        coutDomaine: parseFormula(row[12]),
                        autresCouts: parseFormula(row[13]) || 0,
                        status: row[7] === 1 ? 'client' : (row[6] === 1 ? 'prospect' : 'lead'),
                        notes: '',
                        dateAdded: new Date().toISOString()
                    });
                }
            }

            setClients([...clients, ...imported]);
            showToast(`${imported.length} clients importés !`);
        };
        reader.readAsArrayBuffer(file);
    };

    const exportExcel = () => {
        const data = [
            ['Nom', 'Site', 'Secteur', 'Source', 'Statut', 'Montant', 'Abonnement', 'Coût Replit', 'Coût Domaine', 'Autres Coûts', 'Notes'],
            ...clients.map(c => [
                c.name, c.site, c.secteur, c.source, c.status, 
                c.montant, c.abonnement, c.coutReplit, c.coutDomaine, c.autresCouts, c.notes
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Clients');
        XLSX.writeFile(wb, 'donecrm-export.xlsx');
        showToast('Export réussi !');
    };

    return (
        <div className="min-h-screen p-6">
            <header className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="app-title text-5xl mb-2">DoneCRM</h1>
                        <p className="text-slate-400">Gestion business simplifiée</p>
                    </div>
                    <div className="flex gap-3">
                        <label className="btn-secondary cursor-pointer">
                            📥 Importer Excel
                            <input type="file" accept=".xlsx,.xls" onChange={importExcel} className="hidden" />
                        </label>
                        <button onClick={exportExcel} className="btn-secondary">
                            📤 Exporter
                        </button>
                        <button onClick={() => { setEditingClient(null); setShowModal(true); }} className="btn-primary">
                            + Nouveau Client
                        </button>
                    </div>
                </div>

                <nav className="flex gap-6 border-b border-slate-700">
                    <div className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        📊 Dashboard
                    </div>
                    <div className={`tab ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>
                        🎯 Pipeline
                    </div>
                    <div className={`tab ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}>
                        👥 Tous les clients
                    </div>
                    <div className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                        ⚙️ Paramètres
                    </div>
                </nav>
            </header>

            {activeTab === 'dashboard' && <Dashboard metrics={metrics} clients={clients} />}
            {activeTab === 'pipeline' && <Pipeline clients={clients} updateClientStatus={updateClientStatus} setEditingClient={setEditingClient} setShowModal={setShowModal} />}
            {activeTab === 'clients' && <ClientsList clients={clients} setEditingClient={setEditingClient} setShowModal={setShowModal} deleteClient={deleteClient} />}
            {activeTab === 'settings' && <Settings coutMeta={coutMeta} setCoutMeta={setCoutMeta} coutDone={coutDone} setCoutDone={setCoutDone} />}

            {showModal && <ClientModal client={editingClient} onSave={addClient} onClose={() => { setShowModal(false); setEditingClient(null); }} />}
            {toast && <div className="toast">{toast}</div>}
        </div>
    );
}

function Dashboard({ metrics, clients }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const ctx = chartRef.current.getContext('2d');
            
            const secteurs = {};
            clients.filter(c => c.status === 'client').forEach(c => {
                secteurs[c.secteur] = (secteurs[c.secteur] || 0) + (c.montant || 0);
            });

            chartInstance.current = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(secteurs),
                    datasets: [{
                        data: Object.values(secteurs),
                        backgroundColor: [
                            'rgba(249, 115, 22, 0.8)',
                            'rgba(251, 146, 60, 0.8)',
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#cbd5e1',
                                font: { size: 12, family: 'DM Sans' }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [clients]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <div className="animate-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card stat-card p-6">
                    <div className="text-slate-400 text-sm mb-2">MRR (Monthly)</div>
                    <div className="text-3xl font-bold text-orange-500">{formatCurrency(metrics.mrr)}</div>
                    <div className="text-xs text-slate-500 mt-2">ARR: {formatCurrency(metrics.arr)}</div>
                </div>

                <div className="card stat-card p-6">
                    <div className="text-slate-400 text-sm mb-2">CA Total</div>
                    <div className="text-3xl font-bold">{formatCurrency(metrics.totalVentes)}</div>
                    <div className="text-xs text-green-400 mt-2">+{metrics.nbrClients} clients actifs</div>
                </div>

                <div className="card stat-card p-6">
                    <div className="text-slate-400 text-sm mb-2">Marge</div>
                    <div className="text-3xl font-bold text-green-400">{formatCurrency(metrics.marge)}</div>
                    <div className="text-xs text-slate-500 mt-2">Coûts: {formatCurrency(metrics.totalCouts)}</div>
                </div>

                <div className="card stat-card p-6">
                    <div className="text-slate-400 text-sm mb-2">Pipeline</div>
                    <div className="text-3xl font-bold">{metrics.nbrLeads + metrics.nbrProspects + metrics.nbrClients}</div>
                    <div className="text-xs text-slate-500 mt-2">
                        {metrics.nbrLeads} leads • {metrics.nbrProspects} prospects
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">CA par Secteur</h3>
                    <div style={{ height: '300px' }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">Derniers Clients</h3>
                    <div className="space-y-3">
                        {clients
                            .filter(c => c.status === 'client')
                            .slice(-5)
                            .reverse()
                            .map(client => (
                                <div key={client.id} className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                                    <div>
                                        <div className="font-semibold">{client.name}</div>
                                        <div className="text-sm text-slate-400">{client.secteur}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-orange-500">{formatCurrency(client.montant)}</div>
                                        <div className="text-xs text-slate-400">{formatCurrency(client.abonnement)}/mois</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="card p-6">
                    <h3 className="text-lg font-bold mb-3 text-orange-500">💰 Détail Coûts</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Meta Ads</span>
                            <span className="font-semibold">{formatCurrency(metrics.totalCouts > 0 ? 100 : 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Done (salaires)</span>
                            <span className="font-semibold">{formatCurrency(90.47)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Replit</span>
                            <span className="font-semibold">{formatCurrency(metrics.totalCoutsReplit)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Domaines</span>
                            <span className="font-semibold">{formatCurrency(metrics.totalCoutsDomaine)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-700">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-orange-500">{formatCurrency(metrics.totalCouts)}</span>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-bold mb-3 text-orange-500">📈 Taux de Conversion</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Lead → Prospect</span>
                                <span className="font-semibold">
                                    {metrics.nbrLeads > 0 ? Math.round((metrics.nbrProspects / metrics.nbrLeads) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${metrics.nbrLeads > 0 ? (metrics.nbrProspects / metrics.nbrLeads) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-400">Prospect → Client</span>
                                <span className="font-semibold">
                                    {metrics.nbrProspects > 0 ? Math.round((metrics.nbrClients / metrics.nbrProspects) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${metrics.nbrProspects > 0 ? (metrics.nbrClients / metrics.nbrProspects) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="text-lg font-bold mb-3 text-orange-500">🎯 Objectifs</h3>
                    <div className="space-y-3 text-sm">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-400">MRR Goal: €500</span>
                                <span className="font-semibold">{Math.round((metrics.mrr / 500) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${Math.min((metrics.mrr / 500) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Clients Goal: 20</span>
                                <span className="font-semibold">{Math.round((metrics.nbrClients / 20) * 100)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: `${Math.min((metrics.nbrClients / 20) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Pipeline({ clients, updateClientStatus, setEditingClient, setShowModal }) {
    const [draggedClient, setDraggedClient] = useState(null);

    const stages = [
        { id: 'lead', name: 'Leads', color: 'blue' },
        { id: 'prospect', name: 'Prospects', color: 'purple' },
        { id: 'client', name: 'Clients', color: 'green' },
        { id: 'churned', name: 'Churn', color: 'red' }
    ];

    const handleDragStart = (client) => {
        setDraggedClient(client);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, status) => {
        e.preventDefault();
        if (draggedClient) {
            updateClientStatus(draggedClient.id, status);
            setDraggedClient(null);
        }
    };

    return (
        <div className="animate-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stages.map(stage => (
                    <div key={stage.id}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{stage.name}</h3>
                            <span className={`badge badge-${stage.color}`}>
                                {clients.filter(c => c.status === stage.id).length}
                            </span>
                        </div>
                        
                        <div 
                            className="pipeline-column"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, stage.id)}
                        >
                            {clients
                                .filter(c => c.status === stage.id)
                                .map(client => (
                                    <div
                                        key={client.id}
                                        className="client-card"
                                        draggable
                                        onDragStart={() => handleDragStart(client)}
                                        onClick={() => { setEditingClient(client); setShowModal(true); }}
                                    >
                                        <div className="font-bold mb-2">{client.name}</div>
                                        <div className="text-sm text-slate-400 mb-2">{client.secteur}</div>
                                        {client.montant > 0 && (
                                            <div className="text-orange-500 font-semibold">
                                                {new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(client.montant)}
                                            </div>
                                        )}
                                        {client.abonnement > 0 && (
                                            <div className="text-xs text-green-400">
                                                {new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(client.abonnement)}/mois
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ClientsList({ clients, setEditingClient, setShowModal, deleteClient }) {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filteredClients = clients.filter(c => {
        const matchesFilter = filter === 'all' || c.status === filter;
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                            c.secteur.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="animate-in">
            <div className="card p-6">
                <div className="flex gap-4 mb-6">
                    <input 
                        type="text" 
                        placeholder="🔍 Rechercher un client..." 
                        className="input-field flex-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="select-field" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Tous</option>
                        <option value="lead">Leads</option>
                        <option value="prospect">Prospects</option>
                        <option value="client">Clients</option>
                        <option value="churned">Churn</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Secteur</th>
                                <th>Statut</th>
                                <th>Montant</th>
                                <th>Abonnement</th>
                                <th>Site</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => (
                                <tr key={client.id}>
                                    <td className="font-semibold">{client.name}</td>
                                    <td className="text-slate-400">{client.secteur}</td>
                                    <td>
                                        <span className={`badge badge-${client.status === 'lead' ? 'lead' : client.status === 'prospect' ? 'prospect' : client.status === 'client' ? 'client' : 'churned'}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="text-orange-500 font-semibold">
                                        {new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(client.montant || 0)}
                                    </td>
                                    <td className="text-green-400">
                                        {new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(client.abonnement || 0)}
                                    </td>
                                    <td>
                                        {client.site && (
                                            <a href={client.site} target="_blank" className="text-blue-400 hover:underline text-sm">
                                                🔗 Voir
                                            </a>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => { setEditingClient(client); setShowModal(true); }}
                                                className="text-orange-500 hover:text-orange-400 text-sm font-semibold"
                                            >
                                                ✏️ Éditer
                                            </button>
                                            <button 
                                                onClick={() => deleteClient(client.id)}
                                                className="text-red-500 hover:text-red-400 text-sm font-semibold"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function Settings({ coutMeta, setCoutMeta, coutDone, setCoutDone }) {
    return (
        <div className="animate-in">
            <div className="card p-8 max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Paramètres</h2>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-400 mb-2">Coût Meta Ads (€/mois)</label>
                        <input 
                            type="number" 
                            className="input-field"
                            value={coutMeta}
                            onChange={(e) => setCoutMeta(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2">Coût Done/Salaires (€/mois)</label>
                        <input 
                            type="number" 
                            className="input-field"
                            value={coutDone}
                            onChange={(e) => setCoutDone(parseFloat(e.target.value) || 0)}
                        />
                    </div>

                    <div className="pt-6 border-t border-slate-700">
                        <h3 className="font-bold mb-4">Actions</h3>
                        <div className="space-y-3">
                            <button 
                                onClick={() => {
                                    if (confirm('Supprimer toutes les données ?')) {
                                        localStorage.removeItem('donecrm-clients');
                                        localStorage.removeItem('donecrm-couts');
                                        window.location.reload();
                                    }
                                }}
                                className="btn-secondary w-full text-red-400 border-red-400/30 hover:bg-red-400/10"
                            >
                                🗑️ Réinitialiser toutes les données
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClientModal({ client, onSave, onClose }) {
    const [formData, setFormData] = useState(client || {
        name: '',
        site: '',
        secteur: 'Horeca',
        source: 'Out',
        status: 'lead',
        contacted: false,
        called: false,
        sold: false,
        montant: 0,
        abonnement: 0,
        coutReplit: 0,
        coutDomaine: 0,
        autresCouts: 0,
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">
                    {client ? 'Modifier' : 'Nouveau'} Client
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Nom *</label>
                            <input 
                                type="text" 
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Secteur</label>
                            <select 
                                className="select-field w-full"
                                value={formData.secteur}
                                onChange={(e) => setFormData({...formData, secteur: e.target.value})}
                            >
                                <option>Horeca</option>
                                <option>Fitness</option>
                                <option>Esthétique</option>
                                <option>Onglerie</option>
                                <option>Carrosserie</option>
                                <option>Autre</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">Site web</label>
                        <input 
                            type="url" 
                            className="input-field"
                            value={formData.site}
                            onChange={(e) => setFormData({...formData, site: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Statut</label>
                            <select 
                                className="select-field w-full"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="lead">Lead</option>
                                <option value="prospect">Prospect</option>
                                <option value="client">Client</option>
                                <option value="churned">Churned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Source</label>
                            <select 
                                className="select-field w-full"
                                value={formData.source}
                                onChange={(e) => setFormData({...formData, source: e.target.value})}
                            >
                                <option value="Out">Outbound</option>
                                <option value="In">Inbound</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Montant vente (€)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="input-field"
                                value={formData.montant}
                                onChange={(e) => setFormData({...formData, montant: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Abonnement (€/mois)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="input-field"
                                value={formData.abonnement}
                                onChange={(e) => setFormData({...formData, abonnement: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Coût Replit (€)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="input-field"
                                value={formData.coutReplit}
                                onChange={(e) => setFormData({...formData, coutReplit: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Coût Domaine (€)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="input-field"
                                value={formData.coutDomaine}
                                onChange={(e) => setFormData({...formData, coutDomaine: parseFloat(e.target.value) || 0})}
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-2 text-sm">Autres coûts (€)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="input-field"
                                value={formData.autresCouts}
                                onChange={(e) => setFormData({...formData, autresCouts: parseFloat(e.target.value) || 0})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-2 text-sm">Notes</label>
                        <textarea 
                            className="input-field"
                            rows="3"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button type="submit" className="btn-primary flex-1">
                            {client ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
