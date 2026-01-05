import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';

// Types
type StudentRow = {
  id: string;
  studentCode: string;
  firstName: string;
  lastNameInitial: string;
  className: string;
  lastAssessment?: {
    date?: string;
    status: 'none' | 'draft' | 'completed';
    totalScore?: number;
    riskLevel?: 'low' | 'medium' | 'high';
  };
};

// Mock Data
const mockStudents: StudentRow[] = [
  {
    id: '1',
    studentCode: 'T001',
    firstName: 'שרה',
    lastNameInitial: 'כ',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-20',
      status: 'completed',
      totalScore: 85,
      riskLevel: 'low'
    }
  },
  {
    id: '2',
    studentCode: 'T002',
    firstName: 'רחל',
    lastNameInitial: 'ל',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-18',
      status: 'draft',
      riskLevel: 'medium'
    }
  },
  {
    id: '3',
    studentCode: 'T003',
    firstName: 'לאה',
    lastNameInitial: 'מ',
    className: 'כיתה ז1',
    lastAssessment: {
      status: 'none'
    }
  },
  {
    id: '4',
    studentCode: 'T004',
    firstName: 'מרים',
    lastNameInitial: 'ש',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-15',
      status: 'completed',
      totalScore: 62,
      riskLevel: 'high'
    }
  },
  {
    id: '5',
    studentCode: 'T005',
    firstName: 'דבורה',
    lastNameInitial: 'ב',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-22',
      status: 'completed',
      totalScore: 78,
      riskLevel: 'low'
    }
  },
  {
    id: '6',
    studentCode: 'T006',
    firstName: 'אסתר',
    lastNameInitial: 'ר',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-19',
      status: 'draft',
      riskLevel: 'medium'
    }
  },
  {
    id: '7',
    studentCode: 'T007',
    firstName: 'חנה',
    lastNameInitial: 'ג',
    className: 'כיתה ז1',
    lastAssessment: {
      status: 'none'
    }
  },
  {
    id: '8',
    studentCode: 'T008',
    firstName: 'יהודית',
    lastNameInitial: 'ד',
    className: 'כיתה ז1',
    lastAssessment: {
      date: '2024-12-21',
      status: 'completed',
      totalScore: 91,
      riskLevel: 'low'
    }
  }
];

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock teacher data
  const teacherName = 'מורה דוגמה';
  const className = 'כיתה ז1';
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [loading] = useState(false);
  const [error] = useState(false);
  
  // TODO: Replace with actual RTK Query hook
  // const { data: students, isLoading, error } = useGetMyStudentsQuery();
  const students = mockStudents;
  
  // Filter options
  const statusOptions = [
    { label: 'הכל', value: 'all' },
    { label: 'ללא הערכה', value: 'none' },
    { label: 'טיוטה', value: 'draft' },
    { label: 'הושלם', value: 'completed' }
  ];
  
  const riskOptions = [
    { label: 'הכל', value: 'all' },
    { label: 'נמוך', value: 'low' },
    { label: 'בינוני', value: 'medium' },
    { label: 'גבוה', value: 'high' }
  ];
  
  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchTerm === '' || 
        student.firstName.includes(searchTerm) ||
        student.studentCode.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        student.lastAssessment?.status === statusFilter;
      
      const matchesRisk = riskFilter === 'all' || 
        student.lastAssessment?.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });
  }, [students, searchTerm, statusFilter, riskFilter]);
  
  // Calculate summary statistics
  const stats = useMemo(() => {
    const total = students.length;
    const drafts = students.filter(s => s.lastAssessment?.status === 'draft').length;
    const completed = students.filter(s => s.lastAssessment?.status === 'completed').length;
    const highRisk = students.filter(s => s.lastAssessment?.riskLevel === 'high').length;
    
    return { total, drafts, completed, highRisk };
  }, [students]);
  
  // Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setRiskFilter('all');
  };
  
  const handleViewStudent = (studentId: string) => {
    navigate(`/teacher/students/${studentId}`);
  };
  
  const handleStartAssessment = (studentId: string) => {
    navigate(`/teacher/students/${studentId}/assessment`);
  };
  
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };
  
  const handleStats = () => {
    // TODO: Navigate to statistics page
    console.log('Statistics clicked');
  };
  
  // Column templates
  const studentNameTemplate = (rowData: StudentRow) => {
    return `${rowData.firstName} ${rowData.lastNameInitial}.`;
  };
  
  const statusTemplate = (rowData: StudentRow) => {
    const status = rowData.lastAssessment?.status || 'none';
    const statusConfig = {
      none: { label: 'אין', severity: 'secondary' as const },
      draft: { label: 'טיוטה', severity: 'warning' as const },
      completed: { label: 'הושלם', severity: 'success' as const }
    };
    
    const config = statusConfig[status];
    return <Tag value={config.label} severity={config.severity} />;
  };
  
  const dateTemplate = (rowData: StudentRow) => {
    if (!rowData.lastAssessment?.date) return '—';
    const date = new Date(rowData.lastAssessment.date);
    return date.toLocaleDateString('he-IL');
  };
  
  const riskTemplate = (rowData: StudentRow) => {
    const risk = rowData.lastAssessment?.riskLevel;
    if (!risk) return '—';
    
    const riskConfig = {
      low: { label: 'נמוך', severity: 'success' as const },
      medium: { label: 'בינוני', severity: 'warning' as const },
      high: { label: 'גבוה', severity: 'danger' as const }
    };
    
    const config = riskConfig[risk];
    return <Tag value={config.label} severity={config.severity} />;
  };
  
  const actionsTemplate = (rowData: StudentRow) => {
    const status = rowData.lastAssessment?.status || 'none';
    let assessmentLabel = 'התחל הערכה';
    
    if (status === 'draft') {
      assessmentLabel = 'המשך הערכה';
    } else if (status === 'completed') {
      assessmentLabel = 'הערכה חדשה';
    }
    
    return (
      <div className="flex gap-2">
        <Button 
          label="צפייה" 
          icon="pi pi-eye" 
          size="small"
          outlined
          onClick={() => handleViewStudent(rowData.id)}
        />
        <Button 
          label={assessmentLabel}
          icon="pi pi-pencil" 
          size="small"
          onClick={() => handleStartAssessment(rowData.id)}
        />
      </div>
    );
  };
  
  const rowClassName = (rowData: StudentRow) => {
    return rowData.lastAssessment?.riskLevel === 'high' ? 'bg-red-50' : '';
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <ProgressSpinner />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-4">
        <Message severity="error" text="שגיאה בטעינת נתונים. אנא נסה שנית." />
      </div>
    );
  }
  
  return (
    <div dir="rtl" className="p-4">
      {/* Header Section */}
      <Card className="mb-4">
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
          <div>
            <h1 className="text-4xl font-bold text-primary m-0 mb-2">תלמידות הכיתה שלי</h1>
            <p className="text-600 m-0">שלום, {teacherName} | כיתה: {className}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              label="סטטיסטיקה לכיתה" 
              icon="pi pi-chart-bar" 
              outlined
              onClick={handleStats}
            />
            <Button 
              label="התנתקות" 
              icon="pi pi-sign-out" 
              severity="secondary"
              outlined
              onClick={handleLogout}
            />
          </div>
        </div>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid mb-4">
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-blue-50 border-left-3 border-primary">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">סה"כ תלמידות</div>
                <div className="text-4xl font-bold text-primary">{stats.total}</div>
              </div>
              <i className="pi pi-users text-5xl text-primary opacity-50"></i>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-yellow-50 border-left-3 border-yellow-500">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">טיוטות פתוחות</div>
                <div className="text-4xl font-bold text-yellow-600">{stats.drafts}</div>
              </div>
              <i className="pi pi-file-edit text-5xl text-yellow-500 opacity-50"></i>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-green-50 border-left-3 border-green-500">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">הערכות שהושלמו</div>
                <div className="text-4xl font-bold text-green-600">{stats.completed}</div>
              </div>
              <i className="pi pi-check-circle text-5xl text-green-500 opacity-50"></i>
            </div>
          </Card>
        </div>
        
        <div className="col-12 md:col-6 lg:col-3">
          <Card className="bg-orange-50 border-left-3 border-orange-500">
            <div className="flex justify-content-between align-items-center">
              <div>
                <div className="text-500 font-medium mb-2">סיכון גבוה</div>
                <div className="text-4xl font-bold text-orange-600">{stats.highRisk}</div>
              </div>
              <i className="pi pi-exclamation-triangle text-5xl text-orange-500 opacity-50"></i>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Filters Section */}
      <Card className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-4">
            <span className="p-input-icon-left w-full">
              <i className="pi pi-search" />
              <InputText 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חיפוש לפי שם או קוד תלמידה..."
                className="w-full"
              />
            </span>
          </div>
          
          <div className="col-12 md:col-3">
            <Dropdown 
              value={statusFilter}
              options={statusOptions}
              onChange={(e) => setStatusFilter(e.value)}
              placeholder="סטטוס הערכה"
              className="w-full"
            />
          </div>
          
          <div className="col-12 md:col-3">
            <Dropdown 
              value={riskFilter}
              options={riskOptions}
              onChange={(e) => setRiskFilter(e.value)}
              placeholder="רמת סיכון"
              className="w-full"
            />
          </div>
          
          <div className="col-12 md:col-2">
            <Button 
              label="נקה פילטרים" 
              icon="pi pi-filter-slash"
              outlined
              className="w-full"
              onClick={handleClearFilters}
            />
          </div>
        </div>
      </Card>
      
      {/* Students DataTable */}
      <Card>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <i className="pi pi-inbox text-6xl text-400 mb-3"></i>
            <p className="text-xl text-600 m-0">אין תלמידות להצגה</p>
            <p className="text-500 mt-2">נסה לשנות את הפילטרים או החיפוש</p>
          </div>
        ) : (
          <DataTable 
            value={filteredStudents}
            stripedRows
            rowClassName={rowClassName}
            onRowClick={(e) => handleViewStudent(e.data.id)}
            rowHover
          >
            <Column 
              field="studentCode" 
              header="קוד" 
              sortable
              style={{ width: '100px' }}
            />
            <Column 
              header="שם תלמידה" 
              body={studentNameTemplate}
              sortable
              sortField="firstName"
            />
            <Column 
              field="className" 
              header="כיתה"
              sortable
              style={{ width: '120px' }}
            />
            <Column 
              header="סטטוס הערכה" 
              body={statusTemplate}
              sortable
              sortField="lastAssessment.status"
              style={{ width: '150px' }}
            />
            <Column 
              header="תאריך אחרון" 
              body={dateTemplate}
              sortable
              sortField="lastAssessment.date"
              style={{ width: '130px' }}
            />
            <Column 
              header="רמת סיכון" 
              body={riskTemplate}
              sortable
              sortField="lastAssessment.riskLevel"
              style={{ width: '120px' }}
            />
            <Column 
              header="פעולות" 
              body={actionsTemplate}
              style={{ width: '280px' }}
            />
          </DataTable>
        )}
      </Card>
    </div>
  );
};

export default TeacherDashboard;