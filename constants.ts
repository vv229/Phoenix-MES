
import { Task, InspectionStatus, InspectionResult, InspectionDetailData, BomItem, StationLog, EquipmentItem } from './types';

export const MOCK_TASKS: Task[] = [
  // 来料检验单据 (IQC)
  {
    id: 'ASN20240501001',
    asnNo: 'ASN20240501001',
    supplierCode: 'V000892',
    supplierName: '上海联泰科技股份有限公司',
    deliveryAddr: '广州市番禺区南村镇工业路12号',
    deliveryDate: '2024-05-01',
    factory: '1000',
    warehouseKeeper: '王五',
    storageLocation: 'RM01',
    lineNo: '10',
    productCode: '06TVA819SX1CA1',
    productName: '压缩机减震垫',
    unit: 'PC',
    poNo: 'PO8899201',
    deliveryQty: '500',
    sn: 'N/A',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    inspector: '张工',
    createTime: '2024-05-01 08:00',
    priority: 'High',
    docStatus: '已发布'
  },
  {
    id: 'ASN20240501002',
    asnNo: 'ASN20240501002',
    supplierCode: 'V000755',
    supplierName: '博世热力技术(北京)有限公司',
    deliveryAddr: '北京市朝阳区酒仙桥路10号',
    deliveryDate: '2024-05-01',
    factory: '1000',
    warehouseKeeper: '赵六',
    storageLocation: 'RM02',
    lineNo: '20',
    productCode: '30XQ0600GLBW',
    productName: '冷凝器风扇电机',
    unit: 'SET',
    poNo: 'PO8899305',
    deliveryQty: '24',
    sn: 'N/A',
    status: InspectionStatus.IN_PROGRESS,
    result: InspectionResult.NONE,
    inspector: '李工',
    createTime: '2024-05-01 09:30',
    priority: 'Normal',
    docStatus: '检验中'
  },
  // FQC/过程原数据
  {
    id: 'GCJ10919356',
    workOrder: '10907558',
    salesOrder: '10165731',
    lineNo: '10',
    productCode: '30RB202C',
    productName: '涡旋式风冷冷水机组',
    unitModel: '30RB202CPT254',
    line: '01',
    inspector: '张三',
    sn: '202512120001',
    processName: '大件装配',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 08:30',
    workshop: '星火车间',
    priority: 'High',
    woNotes: `Y-INQ-0000024558-1；广西植护元创纸业有限公司40td二氧化氯项目_冰水机；/10KV，不带启动柜，带转换柜：32XRK5APMD0000052DNAM5F_GXZPY(F_GXZPY：安科/瑞模块转换柜)； 需要注意此评审客户不需要启动柜， 已提供对应的审批邮件；/蒸发管（铜镍90：10）：10XR05019207EX1 * 726；冷凝管（铜镍90：10）：09XR0/5119005TLC * 781；蒸发器接口法兰及对接法兰非标配置PN16承压等级：10XR7401/0405（标准零件号）配对法兰也需要更换为PN16承压等级；冷凝器接口法兰及对接/法兰非标配置PN16承压等级：09XR74010802（标准零件号）配对法兰也需要更换为/PN16承压等级；工艺型机组能效备案，按照客户资料提供；技术准备周期10个工作/日；`,
    techNotes: `HSY;蒸发器/冷凝器：1、铜镍管；2、带压差式流量开关（需要有球阀）；3、水室接管法兰PN16承压；安科瑞模块转换柜：32XRK5APMD0000052DNAM5F_GXZPY； 换热器外协`
  },
  {
    id: 'GCJ10919362',
    workOrder: '10919304',
    salesOrder: '20013945',
    lineNo: '10',
    productCode: '30KAV0800AA',
    productName: '30KAV机组',
    unitModel: '30KAV0800APT015S',
    line: '02',
    inspector: '李四',
    sn: '202512120002',
    processName: '管配',
    status: InspectionStatus.IN_PROGRESS,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 09:15',
    workshop: '螺杆车间',
    priority: 'Normal',
    woNotes: '常规标准配置',
    techNotes: '注意检查接线端子紧固度'
  }
];

export const WORKSHOPS = ['星火车间', '螺杆车间', '离心车间'];

// Mock Detail Data
export const MOCK_INSPECTION_DETAIL: InspectionDetailData = {
  taskId: 'generic',
  capturedPhotos: [],
  groups: [
    {
      id: 'g1',
      name: '外观检查',
      type: 'QUALITATIVE',
      progress: 0,
      status: 'PENDING',
      groupResult: 'PASS', 
      items: [
        { id: 'i1', seq: 1, category: '外观', requirement: '包装完整，无挤压变形', method: '目视', sampleCount: 1, defectCount: 0, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: true },
        { id: 'i2', seq: 2, category: '外观', requirement: '物料表面无划伤', method: '目视', sampleCount: 10, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: false },
      ]
    },
    {
      id: 'g4',
      name: '尺寸测量',
      type: 'QUANTITATIVE',
      progress: 0,
      status: 'PENDING',
      groupResult: 'NONE',
      items: [
        { id: 'd1', seq: 1, category: '尺寸', requirement: '关键尺寸 A', method: '游标卡尺', sampleCount: 5, specMin: 90, specMax: 110, measuredValues: ['', '', '', '', ''], result: null, isMandatory: true, isPhotoRequired: false },
      ]
    }
  ],
  attachments: [
      { name: '供应商合格证', url: '#', date: '2024-05-01' },
  ]
};

// --- Station Collection Mock Data ---
export const MOCK_BOM: BomItem[] = [
    { id: '1', seq: 1, materialCode: '06TVA819SX1CA1', qty: 1, isKeyPart: true, scannedQty: 0, hasDrawing: true },
];

export const MOCK_LOGS: StationLog[] = [
    { id: '1', timestamp: '2025/12/12 8:22:23', type: 'SUCCESS', action: '进站', message: '条码: 232373434 成功!' },
];

export const MOCK_EQUIPMENT: EquipmentItem[] = [
    { 
        id: 'e1', code: 'Equip00000011', name: '立卡设备', type: 'DEVICE', dept: '生产部', status: 'NOT_STARTED',
        checkItems: [{ content: '检查钢丝绳表面：要求目视可见无磨损、无断裂', standard: '文本标签', cycle: '每天', result: null }]
    }
];
