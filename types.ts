
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

export type InspectionModule = 'FQC' | 'PROCESS' | 'COMPLETION' | 'INCOMING' | 'PICKING' | 'DEVICE_MAINTENANCE' | 'WAREHOUSE_CALL';

export interface Task {
  id: string;          // 检验单号/ASN编号/保养单号
  workOrder?: string;   // 工单 (FQC/过程)
  salesOrder?: string;  // 销售单号
  lineNo: string;      // 行号 (ASN行号或工单行号)
  productCode: string; // 物料编码/设备编码
  productName: string; // 物料描述/设备名称
  unitModel?: string;   // 机组型号
  line?: string;        // 产线
  inspector: string;   // 检验员/保养人
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

  // 设备保养专用字段
  deviceCode?: string;
  deviceName?: string;
  department?: string; // 确认部门
  maintenanceTime?: string; // 保养时间
  maintenancePerson?: string; // 保养人
  isRepaired?: boolean; // 是否已报修
  lastMaintenanceSummary?: string; // 上次保养小结
}

// --- 物料拣配 (Picking) 相关类型 ---

export type PickingStatus = 'PENDING' | 'PARTIAL' | 'READY'; // 待拣配 | 部分拣配 | 已备料

export interface PickingItem {
  id: string;
  materialCode: string;
  description: string;
  qty: number;
  unit: string;
  sourceLoc: string;
  admin: string; // 管理员分组
  isPicked: boolean;
  pickedTime?: string;
  assignedCart?: string;
}

export interface PickingTask {
  id: string; // 拣配单号
  soNo: string;
  woNo: string;
  planDate: string;
  model: string;
  status: PickingStatus;
  items: PickingItem[];
  processCode?: string; // 工序编码
  processName?: string; // 工序名称
  workshop?: string;    // 车间
  line?: string;        // 线体
}

// --- 仓储叫料 (Warehouse Material Call) 相关类型 ---
export interface MaterialCallItem {
  id: string;
  woNo: string; // 工单号
  planDate: string; // 需求时间
  materialCode: string; // 物料编码
  description: string; // 物料名称
  model: string; // 型号
  admin: string; // 管理员
  sourceLoc: string; // 仓储库存地点
  virtualFlag: string; // 虚拟标识
  targetLoc: string; // 车间需求地点
  qty: number; // 需求数量
  pickedQty: number; // 已拣数量
  remarks?: string; // 备注
  status: 'PENDING' | 'PARTIAL' | 'COMPLETED'; // 状态: 待拣配/部分拣配/已拣配
}

export interface MaintenanceItem {
  id: string;
  name: string; // 项目名称: 清洁
  position: string; // 部位: 机械臂
  consumables: string; // 项目耗材: 酒精
  method: string; // 操作方法: 外观
  minValue?: number;
  maxValue?: number;
  actualValue?: number;
  result: 'OK' | 'NG' | 'NA' | null; // 合格 | 不合格 | 不适用
  description?: string; // 缺陷描述
  photos: string[]; // 图片上传
  type: 'QUALITATIVE' | 'QUANTITATIVE';
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
