
export enum InspectionStatus {
  PENDING = 'PENDING',      // 待检
  IN_PROGRESS = 'IN_PROGRESS', // 检验中
  COMPLETED = 'COMPLETED'   // 已完成
}

export enum InspectionResult {
  PASS = 'PASS',       // 合格
  FAIL = 'FAIL',       // 不合格
  NONE = 'NONE'        // 未出结果
}

export type InspectionModule = 'FQC' | 'PROCESS' | 'COMPLETION' | 'INCOMING';

export interface Task {
  id: string;          // 检验单号/ASN编号
  workOrder?: string;   // 工单 (FQC/过程)
  salesOrder?: string;  // 销售单号
  lineNo: string;      // 行号 (ASN行号或工单行号)
  productCode: string; // 物料编码
  productName: string; // 物料描述
  unitModel?: string;   // 机组型号
  line?: string;        // 产线
  inspector: string;   // 检验员
  sn: string;          // SN/序列号
  processName?: string; // 工序名称
  status: InspectionStatus;
  result: InspectionResult;
  createTime: string;  // 创建时间
  workshop?: string;    // 车间
  priority: 'High' | 'Normal' | 'Low';
  
  // FQC/过程 备注
  woNotes?: string;    
  techNotes?: string;

  // 来料检验专用字段
  asnNo?: string;
  supplierCode?: string;
  supplierName?: string;
  deliveryAddr?: string;
  deliveryDate?: string;
  factory?: string;
  warehouseKeeper?: string;
  storageLocation?: string;
  poNo?: string;
  deliveryQty?: string;
  unit?: string;
  docStatus?: string;
}

export interface FilterState {
  status: InspectionStatus | 'ALL';
  search: string;
  line: string | 'ALL';
}

// --- Detail View Types ---

export type InspectionType = 'QUALITATIVE' | 'QUANTITATIVE'; // 定性 vs 定量

export interface InspectionItem {
  id: string;
  seq: number;
  category: string; // 检验类别
  requirement: string; // 技术要求
  method: string; // 检验方法/图示
  sampleCount: number; // 样本数
  defectCount?: number; // 不良数
  
  // New field
  isPhotoRequired: boolean; // 是否拍照
  
  // For Qualitative (Appearance)
  checkResult?: 'OK' | 'NG'; 
  
  // For Quantitative (Dimension)
  specMin?: number;
  specMax?: number;
  measuredValues?: string[]; // 实测值
  
  result: 'OK' | 'NG' | null;
  isMandatory: boolean;
}

export interface InspectionGroup {
  id: string;
  name: string; // e.g., "机架外观", "尺寸项目"
  type: InspectionType;
  items: InspectionItem[];
  progress: number; // 0-100
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  groupResult: 'PASS' | 'FAIL' | 'NONE';
}

export interface CapturedPhoto {
  id: string;
  itemId: string;
  dataUrl: string;
  timestamp: number;
}

export interface InspectionDetailData {
  taskId: string;
  groups: InspectionGroup[];
  attachments: { name: string; url: string; date: string }[];
  capturedPhotos: CapturedPhoto[];
}

// --- Station Collection Types ---

export interface BomItem {
  id: string;
  seq: number;
  materialCode: string; // 物料编码
  qty: number;
  isKeyPart: boolean;   // 是否关键件
  scannedQty: number;   // 已扫数量
  hasDrawing: boolean;  // 是否有图纸
}

export interface StationLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'ERROR' | 'SUCCESS';
  action: string;
  message: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  name: string;
  type: 'DEVICE' | 'TOOL' | 'FIXTURE'; // 设备 | 工装 | 吊具
  dept: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  checkItems: {
    content: string;
    standard: string; // 文本标签
    cycle: string; // 每天
    result: 'OK' | 'NG' | null;
  }[];
}
