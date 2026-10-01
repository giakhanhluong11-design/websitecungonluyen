import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight,
  List, Clock, Trash2, X, MoreHorizontal, MapPin, 
  CheckCircle2, Circle, GripVertical, Copy, Palette, Edit2,
  ChevronDown, ChevronRight as ChevronRightIcon, Ban, Info
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

// --- TYPES ---
type RepeatType = 'none' | 'daily' | 'weekly';
type ViewMode = 'week' | 'day' | 'month';

interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  day: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string;
  repeat: RepeatType;
  type: string;
  parentId?: string;
}

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  color: string;
}

// --- CONSTANTS ---
const START_HOUR = 6;
const END_HOUR = 23;
const HOURS_COUNT = END_HOUR - START_HOUR + 1;
const HOUR_HEIGHT = 50; // Giảm kích thước ô
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

const PASTEL_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-teal-100 text-teal-800 border-teal-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-slate-100 text-slate-800 border-slate-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-pink-100 text-pink-800 border-pink-200',
];

const TEXT_COLORS = [
  'text-slate-700', 'text-red-600', 'text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-amber-600'
];

const PREDEFINED_BLOCKS: Record<string, { title: string, color: string }[]> = {
  "Học tập": [
    { title: "Tự học", color: PASTEL_COLORS[0] },
    { title: "Đi học trên lớp", color: PASTEL_COLORS[0] },
    { title: "Học thêm", color: PASTEL_COLORS[0] },
    { title: "Làm bài tập", color: PASTEL_COLORS[1] },
    { title: "Ôn thi", color: PASTEL_COLORS[1] },
    { title: "Đi thi", color: PASTEL_COLORS[1] },
    { title: "Đọc sách", color: PASTEL_COLORS[2] },
    { title: "Họp nhóm", color: PASTEL_COLORS[2] },
  ],
  "Cá nhân": [
    { title: "Nghỉ ngơi", color: PASTEL_COLORS[3] },
    { title: "Ngủ", color: PASTEL_COLORS[7] },
    { title: "Vệ sinh cá nhân", color: PASTEL_COLORS[8] },
    { title: "Tập thể dục", color: PASTEL_COLORS[3] },
    { title: "Ăn sáng", color: PASTEL_COLORS[6] },
    { title: "Ăn trưa", color: PASTEL_COLORS[6] },
    { title: "Ăn tối", color: PASTEL_COLORS[6] },
    { title: "Chăm sóc bản thân", color: PASTEL_COLORS[9] },
  ],
  "Giải trí": [
    { title: "Chơi game", color: PASTEL_COLORS[4] },
    { title: "Xem phim", color: PASTEL_COLORS[4] },
    { title: "Nghe nhạc", color: PASTEL_COLORS[5] },
    { title: "Đọc truyện", color: PASTEL_COLORS[5] },
    { title: "Lướt web", color: PASTEL_COLORS[7] },
  ],
  "Bạn bè & Gia đình": [
    { title: "Gặp mặt bạn bè", color: PASTEL_COLORS[8] },
    { title: "Gọi điện", color: PASTEL_COLORS[8] },
    { title: "Ăn uống gia đình", color: PASTEL_COLORS[6] },
    { title: "Hẹn hò", color: PASTEL_COLORS[9] },
  ],
  "Sự kiện": [
    { title: "Sinh nhật", color: PASTEL_COLORS[1] },
    { title: "Lễ hội", color: PASTEL_COLORS[2] },
    { title: "Đi chơi xa", color: PASTEL_COLORS[3] },
    { title: "Tiệc tùng", color: PASTEL_COLORS[4] },
  ]
};

// --- DATE HELPERS ---
const formatDate = (date: Date) => {
  const d = new Date(date);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const getWeekDays = (startDate: Date) => Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

const timeToMins = (time: string) => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const minsToTime = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

const snapTo15Mins = (mins: number) => Math.round(mins / 15) * 15;
const uid = () => Math.random().toString(36).substring(2, 9);

// --- OVERLAP ALGORITHM ---
const calculateEventLayout = (dayEvents: ScheduleEvent[]) => {
  if (!dayEvents.length) return [];
  const sorted = [...dayEvents].sort((a, b) => timeToMins(a.startTime) - timeToMins(b.startTime));
  
  let clusters: ScheduleEvent[][] = [];
  let currentCluster: ScheduleEvent[] = [];
  let clusterEnd = 0;

  for (const ev of sorted) {
    const start = timeToMins(ev.startTime);
    if (currentCluster.length > 0 && start >= clusterEnd) {
      clusters.push(currentCluster);
      currentCluster = [];
    }
    currentCluster.push(ev);
    clusterEnd = Math.max(clusterEnd, timeToMins(ev.endTime));
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  const results: { event: ScheduleEvent, left: number, width: number }[] = [];
  
  for (const cluster of clusters) {
    const columns: ScheduleEvent[][] = [];
    for (const ev of cluster) {
      let placed = false;
      for (const col of columns) {
        const last = col[col.length - 1];
        if (timeToMins(ev.startTime) >= timeToMins(last.endTime)) {
          col.push(ev);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([ev]);
    }
    const numCols = columns.length;
    for (let i = 0; i < numCols; i++) {
      for (const ev of columns[i]) {
        results.push({ event: ev, left: (i / numCols) * 100, width: 100 / numCols });
      }
    }
  }
  return results;
};

// --- COMPONENT ---
export const ScheduleBuilderView = () => {
  const { showToast, isDirty, setIsDirty } = useAppStore();

  // STATE
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // SIDEBAR STATE
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ todos: true, blocks: true });
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  // UI STATE
  const [editingEvent, setEditingEvent] = useState<Partial<ScheduleEvent> | null>(null);
  const [popover, setPopover] = useState<{ event: ScheduleEvent, x: number, y: number } | null>(null);

  // DRAG STATE (Grid internal)
  const [dragState, setDragState] = useState<{
    action: 'move' | 'resize-top' | 'resize-bottom';
    event: ScheduleEvent;
    startY: number;
    startMins: number;
    endMins: number;
    startDay: string;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const dayColRefs = useRef<(HTMLDivElement | null)[]>([]);

  // INIT & AUTO DELETE PAST DATA
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768 && viewMode !== 'day') {
        setIsMobile(true);
        if (viewMode === 'week') setViewMode('day');
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    let loadedEvents: ScheduleEvent[] = [];
    let loadedTodos: TodoItem[] = [];
    
    const data = localStorage.getItem('cungonluyen_schedule_v3');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.events) loadedEvents = parsed.events;
        if (parsed.todos) loadedTodos = parsed.todos;
      } catch (e) {}
    }

    // AUTO DELETE PAST DATA
    // Xóa dữ liệu của tháng trước trở về trước
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthStartStr = formatDate(currentMonthStart);
    
    const validEvents = loadedEvents.filter(e => e.day >= currentMonthStartStr);
    const validTodos = loadedTodos.filter(t => t.date >= currentMonthStartStr);
    
    setEvents(validEvents);
    setTodos(validTodos);
    
    if (validEvents.length < loadedEvents.length || validTodos.length < loadedTodos.length) {
      localStorage.setItem('cungonluyen_schedule_v3', JSON.stringify({ events: validEvents, todos: validTodos }));
      console.log('Cleaned up past schedule data.');
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (useAppStore.getState().isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(timer);
    };
  }, []);

  const saveToLocal = (newEvents = events, newTodos = todos) => {
    setIsDirty(true);
  };

  const handleSaveToLocal = () => {
    localStorage.setItem('cungonluyen_schedule_v3', JSON.stringify({ events, todos }));
    setIsDirty(false);
    showToast('Đã lưu thời khóa biểu!', 'success');
  };

  // DERIVED
  const todayStr = formatDate(new Date());
  const startOfWeek = getStartOfWeek(currentDate);
  const currentDays = viewMode === 'day' ? [currentDate] : getWeekDays(startOfWeek);
  const todayTodos = todos.filter(t => t.date === todayStr);

  // --- HANDLERS ---
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;
    
    let newEvents = [...events];
    const isNew = !events.some(ev => ev.id === editingEvent.id);
    
    if (isNew) {
      const eData = { ...editingEvent, id: uid() } as ScheduleEvent;
      if (eData.repeat === 'weekly') {
        const parentId = eData.id;
        for (let i = 0; i < 4; i++) {
          const d = addDays(new Date(eData.day), i * 7);
          newEvents.push({ ...eData, id: uid(), day: formatDate(d), parentId });
        }
      } else if (eData.repeat === 'daily') {
        const parentId = eData.id;
        for (let i = 0; i < 7; i++) {
          const d = addDays(new Date(eData.day), i);
          newEvents.push({ ...eData, id: uid(), day: formatDate(d), parentId });
        }
      } else {
        newEvents.push(eData);
      }
    } else {
      newEvents = newEvents.map(ev => ev.id === editingEvent.id ? (editingEvent as ScheduleEvent) : ev);
    }
    
    setEvents(newEvents);
    saveToLocal(newEvents);
    setEditingEvent(null);
  };

  const handleDelete = (id: string, deleteRelated = false) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa?')) return;
    let newEvents = [...events];
    if (deleteRelated) {
      const target = events.find(e => e.id === id);
      const pId = target?.parentId || id;
      newEvents = newEvents.filter(e => e.parentId !== pId && e.id !== pId);
    } else {
      newEvents = newEvents.filter(e => e.id !== id);
    }
    setEvents(newEvents);
    saveToLocal(newEvents);
    setPopover(null);
    setEditingEvent(null);
  };

  // TODOS
  const toggleTodo = (id: string) => {
    const newTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTodos(newTodos);
    saveToLocal(events, newTodos);
  };
  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(t => t.id !== id);
    setTodos(newTodos);
    saveToLocal(events, newTodos);
  };
  const cycleTodoColor = (id: string) => {
    const newTodos = todos.map(t => {
      if (t.id === id) {
        const idx = TEXT_COLORS.indexOf(t.color || TEXT_COLORS[0]);
        return { ...t, color: TEXT_COLORS[(idx + 1) % TEXT_COLORS.length] };
      }
      return t;
    });
    setTodos(newTodos);
    saveToLocal(events, newTodos);
  };
  const addTodo = (title: string) => {
    if (!title.trim()) return;
    const newTodos = [...todos, { id: uid(), title, completed: false, date: todayStr, color: TEXT_COLORS[0] }];
    setTodos(newTodos);
    saveToLocal(events, newTodos);
  };

  // --- GRID INTERACTION ---
  const handleGridClick = (dayStr: string, hour: number, mins: number) => {
    setEditingEvent({
      id: uid(), title: '', description: '', day: dayStr,
      startTime: minsToTime(hour * 60 + mins),
      endTime: minsToTime(hour * 60 + mins + 60),
      color: PASTEL_COLORS[0], repeat: 'none', type: 'activity'
    });
  };

  const handlePointerDown = (e: React.PointerEvent, action: 'move' | 'resize-top' | 'resize-bottom', ev: ScheduleEvent) => {
    if (viewMode === 'month') return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setPopover(null);
    setDragState({ action, event: ev, startY: e.clientY, startMins: timeToMins(ev.startTime), endMins: timeToMins(ev.endTime), startDay: ev.day });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;
    const deltaY = e.clientY - dragState.startY;
    const deltaMins = snapTo15Mins(deltaY / MINUTE_HEIGHT);
    let newStartMins = dragState.startMins;
    let newEndMins = dragState.endMins;
    let newDay = dragState.startDay;

    if (dragState.action === 'resize-bottom') newEndMins = Math.max(newStartMins + 15, dragState.endMins + deltaMins);
    else if (dragState.action === 'resize-top') newStartMins = Math.min(newEndMins - 15, dragState.startMins + deltaMins);
    else if (dragState.action === 'move') {
      newStartMins = dragState.startMins + deltaMins;
      newEndMins = dragState.endMins + deltaMins;
      if (gridRef.current) {
        for (let i = 0; i < currentDays.length; i++) {
          const colRef = dayColRefs.current[i];
          if (colRef) {
            const colRect = colRef.getBoundingClientRect();
            if (e.clientX >= colRect.left && e.clientX <= colRect.right) {
              newDay = formatDate(currentDays[i]); break;
            }
          }
        }
      }
    }

    if (newStartMins < START_HOUR * 60) {
      const diff = START_HOUR * 60 - newStartMins;
      newStartMins += diff; newEndMins += diff;
    }
    if (newEndMins > (END_HOUR + 1) * 60) {
      const diff = newEndMins - (END_HOUR + 1) * 60;
      newStartMins -= diff; newEndMins -= diff;
    }

    setEvents(prev => prev.map(ev => ev.id === dragState.event.id ? { ...ev, startTime: minsToTime(newStartMins), endTime: minsToTime(newEndMins), day: newDay } : ev));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragState) {
      e.target.releasePointerCapture(e.pointerId);
      setDragState(null);
      saveToLocal(events);
    }
  };

  // --- HTML5 DRAG & DROP FOR SIDEBAR BLOCKS ---
  const handleDragStartSidebar = (e: React.DragEvent, title: string, color: string) => {
    e.dataTransfer.setData('block_title', title);
    e.dataTransfer.setData('block_color', color);
  };

  const handleDragOverGrid = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDropGrid = (e: React.DragEvent, dayStr: string, startMins: number) => {
    e.preventDefault();
    const title = e.dataTransfer.getData('block_title');
    const color = e.dataTransfer.getData('block_color');
    if (!title) return;

    const newEv: ScheduleEvent = {
      id: uid(),
      title,
      description: '',
      day: dayStr,
      startTime: minsToTime(startMins),
      endTime: minsToTime(startMins + 60), // Default 1 hour
      color,
      repeat: 'none',
      type: 'activity'
    };
    const newEvents = [...events, newEv];
    setEvents(newEvents);
    saveToLocal(newEvents);
  };

  // --- RENDER MONTH VIEW ---
  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = getStartOfWeek(monthStart);
    
    // Generate grid days
    const calendarDays: Date[] = [];
    let current = startDate;
    while (current <= monthEnd || calendarDays.length % 7 !== 0) {
      calendarDays.push(current);
      current = addDays(current, 1);
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        <div className="grid grid-cols-7 border-b border-slate-200">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
            <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {calendarDays.map((d, i) => {
            const dateStr = formatDate(d);
            const dayEvents = events.filter(e => e.day === dateStr).sort((a,b)=>timeToMins(a.startTime)-timeToMins(b.startTime));
            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
            const isToday = dateStr === todayStr;

            return (
              <div 
                key={i} 
                className={`border-r border-b border-slate-100 p-1 flex flex-col ${!isCurrentMonth ? 'bg-slate-50 opacity-50' : ''}`}
                onClick={() => { setViewMode('day'); setCurrentDate(d); }}
              >
                <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                  {d.getDate()}
                </div>
                <div className="flex-1 overflow-hidden space-y-1">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div 
                      key={ev.id} 
                      className={`text-[9px] font-bold px-1 py-0.5 rounded truncate ${ev.color} cursor-pointer`}
                      title={`${ev.startTime} - ${ev.endTime}\n${ev.title}`}
                      onClick={(e) => { e.stopPropagation(); setPopover({event: ev, x: e.clientX, y: e.clientY}); }}
                    >
                      {ev.startTime} {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[9px] font-bold text-slate-400 px-1">
                      + {dayEvents.length - 3} nữa...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-white font-sans text-slate-800" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      
      {/* HEADER */}
      <header className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 gap-4 shrink-0 bg-white z-20">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-slate-800">
            <CalendarIcon className="w-6 h-6 text-indigo-500" /> Thời khóa biểu
          </h1>
          <p className="text-sm text-slate-500 font-medium">Lên kế hoạch học tập và quản lý thời gian của bạn.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg mr-2">
            {(['week', 'day', 'month'] as ViewMode[]).map(mode => (
              <button
                key={mode} onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {mode === 'week' ? 'Tuần' : mode === 'day' ? 'Ngày' : 'Tháng'}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setCurrentDate(viewMode === 'month' ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1) : addDays(currentDate, viewMode === 'week' ? -7 : -1))} 
              className="p-1 hover:bg-white rounded text-slate-600 shadow-sm"
            ><ChevronLeft className="w-5 h-5"/></button>
            <button 
              onClick={() => setCurrentDate(new Date())} 
              className="px-3 py-1 text-sm font-bold text-slate-700 hover:bg-white rounded shadow-sm whitespace-nowrap"
            >
              {viewMode === 'month' ? 'Tháng này' : 'Hôm nay'}
            </button>
            <button 
              onClick={() => setCurrentDate(viewMode === 'month' ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) : addDays(currentDate, viewMode === 'week' ? 7 : 1))} 
              className="p-1 hover:bg-white rounded text-slate-600 shadow-sm"
            ><ChevronRight className="w-5 h-5"/></button>
          </div>
          
          <button 
            onClick={() => handleGridClick(todayStr, 8, 0)}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tạo block</span>
          </button>
          
          <button 
            onClick={handleSaveToLocal}
            disabled={!isDirty}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
              isDirty ? 'bg-indigo-600 text-white hover:bg-indigo-700 ring-2 ring-indigo-300 ring-offset-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Lưu
            {isDirty && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
          </button>
        </div>
      </header>

      {/* WARNING BANNER */}
      <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <Info className="w-4 h-4" />
        Lưu ý: Dữ liệu lịch và thời khóa biểu của các tháng trước sẽ tự động bị xoá để tiết kiệm bộ nhớ, chỉ hiển thị từ tháng hiện tại trở đi.
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-100 bg-slate-50/50 shrink-0 overflow-y-auto custom-scrollbar">
          
          {/* Section: Việc cần làm */}
          <div className="border-b border-slate-200">
            <div 
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setOpenSections(s => ({...s, todos: !s.todos}))}
            >
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Việc cần làm hôm nay
              </h3>
              {openSections.todos ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
            </div>
            
            {openSections.todos && (
              <div className="px-4 pb-4 space-y-2">
                {todayTodos.map(todo => (
                  <div key={todo.id} className="flex items-start gap-2 group">
                    <button onClick={() => toggleTodo(todo.id)} className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-500 transition-colors">
                      {todo.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <span className={`text-sm break-words flex-1 cursor-pointer select-none ${todo.color || 'text-slate-700'} ${todo.completed ? 'line-through opacity-50' : 'font-medium'}`} onClick={() => cycleTodoColor(todo.id)}>
                      {todo.title}
                    </span>
                    <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity">
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <input 
                  placeholder="+ Thêm việc..."
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-sm font-medium mt-2 outline-none focus:border-indigo-400 transition-colors placeholder-slate-400"
                  onKeyDown={(e) => { if (e.key === 'Enter') { addTodo(e.currentTarget.value); e.currentTarget.value = ''; } }}
                />
              </div>
            )}
          </div>

          {/* Section: Blocks */}
          <div className="">
            <div 
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => setOpenSections(s => ({...s, blocks: !s.blocks}))}
            >
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Blocks thời gian (Kéo thả)
              </h3>
              {openSections.blocks ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRightIcon className="w-4 h-4 text-slate-400" />}
            </div>

            {openSections.blocks && (
              <div className="px-2 pb-4">
                {Object.entries(PREDEFINED_BLOCKS).map(([category, blocks]) => (
                  <div key={category} className="mb-1">
                    <div 
                      className="px-2 py-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-200 rounded-md transition-colors"
                      onClick={() => setOpenCategories(s => ({...s, [category]: !s[category]}))}
                    >
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{category}</span>
                      {openCategories[category] ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRightIcon className="w-3 h-3 text-slate-400" />}
                    </div>
                    
                    {openCategories[category] && (
                      <div className="pl-2 pr-1 pt-1 pb-2 flex flex-wrap gap-1.5 animate-in slide-in-from-top-2">
                        {blocks.map(block => (
                          <div 
                            key={block.title}
                            draggable
                            onDragStart={(e) => handleDragStartSidebar(e, block.title, block.color)}
                            className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded cursor-grab shadow-sm border hover:shadow-md transition-all ${block.color}`}
                          >
                            {block.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </aside>

        {/* MAIN CALENDAR GRID */}
        {viewMode === 'month' ? renderMonthView() : (
          <main className="flex-1 flex flex-col overflow-hidden relative bg-white" ref={gridRef}>
            
            {/* Days Header */}
            <div className="flex border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
              <div className="w-14 sm:w-16 shrink-0 border-r border-slate-100" />
              {currentDays.map((d, i) => {
                const isToday = formatDate(d) === todayStr;
                return (
                  <div key={i} className="flex-1 py-2 text-center border-r border-slate-100 last:border-r-0 min-w-[80px]">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {d.toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </div>
                    <div className={`text-lg sm:text-xl mt-0.5 w-7 h-7 sm:w-8 sm:h-8 mx-auto flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white font-black' : 'font-semibold'}`}>
                      {d.getDate()}
                    </div>
                    <div className="text-[9px] font-medium text-slate-400 mt-0.5">
                      {d.getMonth() + 1}/{d.getFullYear()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div className="flex relative" style={{ height: HOURS_COUNT * HOUR_HEIGHT }}>
                
                {/* Time Labels */}
                <div className="w-14 sm:w-16 shrink-0 border-r border-slate-100 bg-white sticky left-0 z-10">
                  {Array.from({ length: HOURS_COUNT }).map((_, i) => (
                    <div key={i} className="flex items-start justify-end pr-2 pt-1 text-[10px] sm:text-xs font-semibold text-slate-400" style={{ height: HOUR_HEIGHT }}>
                      {`${START_HOUR + i}`.padStart(2, '0')}:00
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {currentDays.map((date, colIdx) => {
                  const dayStr = formatDate(date);
                  const dayEvents = events.filter(e => e.day === dayStr);
                  const layout = calculateEventLayout(dayEvents);
                  const isToday = dayStr === todayStr;

                  return (
                    <div 
                      key={colIdx} 
                      className="flex-1 border-r border-slate-100 last:border-r-0 relative min-w-[80px]"
                      ref={(el) => dayColRefs.current[colIdx] = el}
                      onDragOver={handleDragOverGrid}
                      onDrop={(e) => {
                        const rect = dayColRefs.current[colIdx]!.getBoundingClientRect();
                        const y = e.clientY - rect.top;
                        const startMins = snapTo15Mins((y / HOUR_HEIGHT) * 60) + START_HOUR * 60;
                        handleDropGrid(e, dayStr, startMins);
                      }}
                    >
                      {/* Grid Lines */}
                      {Array.from({ length: HOURS_COUNT }).map((_, h) => (
                        <div key={h} className="absolute w-full border-b border-slate-100/60 pointer-events-none" style={{ top: h * HOUR_HEIGHT, height: HOUR_HEIGHT }}>
                          <div className="absolute w-full border-b border-slate-100/30 border-dashed top-1/2" />
                        </div>
                      ))}

                      {/* Click overlay */}
                      <div 
                        className="absolute inset-0 z-0"
                        onDoubleClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          handleGridClick(dayStr, START_HOUR, snapTo15Mins((y / HOUR_HEIGHT) * 60));
                        }}
                        onClick={(e) => {
                          if (dragState) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          handleGridClick(dayStr, START_HOUR, snapTo15Mins((y / HOUR_HEIGHT) * 60));
                        }}
                      />

                      {/* Current Time Indicator */}
                      {isToday && (
                        <div 
                          className="absolute left-0 right-0 border-t-2 border-red-500 z-10 pointer-events-none flex items-center"
                          style={{ top: ((currentTime.getHours() - START_HOUR) * 60 + currentTime.getMinutes()) * MINUTE_HEIGHT }}
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
                        </div>
                      )}

                      {/* Render Blocks */}
                      {layout.map(({ event, left, width }) => {
                        const startMins = timeToMins(event.startTime);
                        const endMins = timeToMins(event.endTime);
                        const top = (startMins - START_HOUR * 60) * MINUTE_HEIGHT;
                        const height = (endMins - startMins) * MINUTE_HEIGHT;

                        return (
                          <div
                            key={event.id}
                            onPointerDown={(e) => handlePointerDown(e, 'move', event)}
                            onClick={(e) => { e.stopPropagation(); if (dragState) return; setPopover({ event, x: e.clientX, y: e.clientY }); }}
                            className={`absolute rounded-md border shadow-sm hover:shadow-md transition-shadow overflow-hidden p-1 sm:p-1.5 cursor-pointer z-10 ${event.color} ${dragState?.event.id === event.id ? 'opacity-80 ring-2 ring-indigo-500 z-30' : ''}`}
                            style={{ top, height, left: `${left}%`, width: `calc(${width}% - 2px)`, marginLeft: '1px' }}
                          >
                            <div className="text-[9px] font-bold opacity-80 leading-none mb-0.5">{event.startTime} - {event.endTime}</div>
                            <div className="font-bold text-[10px] sm:text-xs leading-tight line-clamp-2">{event.title}</div>
                            {height >= 40 && event.description && (
                              <div className="text-[9px] sm:text-[10px] opacity-90 mt-0.5 line-clamp-2">{event.description}</div>
                            )}

                            <div onPointerDown={(e) => handlePointerDown(e, 'resize-top', event)} className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-black/10" />
                            <div onPointerDown={(e) => handlePointerDown(e, 'resize-bottom', event)} className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-black/10 flex justify-center items-end pb-0.5">
                              <GripVertical className="w-3 h-3 opacity-30 rotate-90" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}
      </div>

      {/* POPOVER */}
      {popover && (
        <div className="fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1 min-w-[150px] animate-in zoom-in-95" style={{ top: Math.min(popover.y, window.innerHeight - 150), left: Math.min(popover.x, window.innerWidth - 160) }}>
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="font-bold text-sm truncate">{popover.event.title}</div>
            <div className="text-xs text-slate-500">{popover.event.startTime} - {popover.event.endTime}</div>
          </div>
          <button onClick={() => { setEditingEvent(popover.event); setPopover(null); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-2"><Edit2 className="w-4 h-4 text-slate-400" /> Chỉnh sửa</button>
          <div className="border-t border-slate-100 my-1" />
          <div className="px-3 py-1 flex gap-1 flex-wrap">
            {PASTEL_COLORS.slice(0, 5).map(c => (
              <div key={c} onClick={() => { setEvents(events.map(e => e.id === popover.event.id ? {...e, color: c} : e)); saveToLocal(); setPopover(null); }} className={`w-6 h-6 rounded-full cursor-pointer border ${c.split(' ')[0]} ${c.split(' ')[2]}`} />
            ))}
          </div>
          <div className="border-t border-slate-100 my-1" />
          <button onClick={() => handleDelete(popover.event.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Xóa block</button>
        </div>
      )}

      {popover && <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} onContextMenu={e => e.preventDefault()} />}

      {/* CREATE MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold">{events.some(e=>e.id===editingEvent.id) ? 'Chỉnh sửa Block' : 'Tạo Block mới'}</h2>
              <button onClick={() => setEditingEvent(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <input autoFocus required placeholder="Tên hoạt động (VD: Học Toán, Nghỉ ngơi)" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full text-xl font-black text-slate-800 border-none outline-none placeholder-slate-300 px-0" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Ngày</label>
                  <input type="date" required value={editingEvent.day} onChange={e => setEditingEvent({...editingEvent, day: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Lặp lại</label>
                  <select value={editingEvent.repeat} onChange={e => setEditingEvent({...editingEvent, repeat: e.target.value as RepeatType})} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"><option value="none">Không lặp</option><option value="daily">Hàng ngày</option><option value="weekly">Hàng tuần</option></select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Bắt đầu</label>
                  <input type="time" required value={editingEvent.startTime} onChange={e => setEditingEvent({...editingEvent, startTime: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Kết thúc</label>
                  <input type="time" required value={editingEvent.endTime} onChange={e => setEditingEvent({...editingEvent, endTime: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {PASTEL_COLORS.map(c => <div key={c} onClick={() => setEditingEvent({...editingEvent, color: c})} className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all ${c.split(' ')[0]} ${c.split(' ')[2]} ${editingEvent.color === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : ''}`} />)}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Mô tả chi tiết</label>
                <textarea rows={3} value={editingEvent.description || ''} onChange={e => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none resize-none" placeholder="Nhập thêm nội dung (không bắt buộc)..." />
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700">Xác nhận</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </div>
  );
};
