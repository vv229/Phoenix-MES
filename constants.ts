import { Task, InspectionStatus, InspectionResult, InspectionDetailData, BomItem, StationLog, EquipmentItem } from './types';

export const MOCK_TASKS: Task[] = [
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
    sn: 'SN1928374650',
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
    sn: 'SN9876543210',
    status: InspectionStatus.IN_PROGRESS,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 09:15',
    workshop: '螺杆车间',
    priority: 'Normal',
    woNotes: '常规标准配置',
    techNotes: '注意检查接线端子紧固度'
  },
  {
    id: 'GCJ10919367',
    workOrder: '10919305',
    salesOrder: '20013945',
    lineNo: '20',
    productCode: '30KA0550A',
    productName: '风冷螺杆冷水机组',
    unitModel: '30KA0550APT003A',
    line: '03',
    inspector: '王五',
    sn: 'SN1122334455',
    status: InspectionStatus.COMPLETED,
    result: InspectionResult.PASS,
    createTime: '2024-05-01 10:00',
    workshop: '离心车间',
    priority: 'Low',
    woNotes: '出口项目，注意铭牌语言',
    techNotes: ''
  },
  {
    id: 'GCJ10919371',
    workOrder: '10919412',
    salesOrder: '20014001',
    lineNo: '10',
    productCode: '19DV-800',
    productName: '双级离心式冷水机组',
    unitModel: '19DV-800-450-ABC',
    line: '04',
    inspector: '赵六',
    sn: 'SN5566778899',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 10:45',
    workshop: '离心车间',
    priority: 'High',
    woNotes: '急单，客户现场等待安装',
    techNotes: '重点检查压缩机油位'
  },
  {
    id: 'GCJ10919375',
    workOrder: '10919455',
    salesOrder: '20014022',
    lineNo: '30',
    productCode: '30XQ500',
    productName: '风冷热泵机组',
    unitModel: '30XQ500-Standard',
    line: '01',
    inspector: '孙七',
    sn: 'SN6677889900',
    status: InspectionStatus.IN_PROGRESS,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 11:30',
    workshop: '螺杆车间',
    priority: 'Normal',
    woNotes: '含热回收选项',
    techNotes: '确认热回收换热器安装方向'
  },
  {
    id: 'GCJ10919382',
    workOrder: '10919501',
    salesOrder: '20014056',
    lineNo: '10',
    productCode: '42CT-004',
    productName: '风机盘管',
    unitModel: '42CT004-200Pa',
    line: '02',
    inspector: '周八',
    sn: 'SN1231231234',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 13:00',
    workshop: '星火车间',
    priority: 'Normal',
    woNotes: '批量订单 (1/50)',
    techNotes: ''
  },
  {
    id: 'GCJ10919388',
    workOrder: '10919512',
    salesOrder: '20014088',
    lineNo: '50',
    productCode: '30HXC300',
    productName: '水冷螺杆机组',
    unitModel: '30HXC300-A',
    line: '03',
    inspector: '吴九',
    sn: 'SN9988776655',
    status: InspectionStatus.COMPLETED,
    result: InspectionResult.FAIL,
    createTime: '2024-04-30 16:20',
    workshop: '螺杆车间',
    priority: 'High',
    woNotes: '返修重检',
    techNotes: '上次检测冷媒泄漏，需重点复核'
  },
  {
    id: 'GCJ10919395',
    workOrder: '10919530',
    salesOrder: '20014102',
    lineNo: '20',
    productCode: '23XRV-500',
    productName: '变频螺杆冷水机组',
    unitModel: '23XRV-500-VFD',
    line: '04',
    inspector: '郑十',
    sn: 'SN4455667788',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-05-01 14:10',
    workshop: '离心车间',
    priority: 'Normal',
    woNotes: '',
    techNotes: ''
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
      name: '机架外观',
      type: 'QUALITATIVE',
      progress: 0,
      status: 'PENDING',
      groupResult: 'PASS', 
      items: [
        { id: 'i1', seq: 1, category: '外观', requirement: '有无变形划伤', method: '查看图片', sampleCount: 5, defectCount: 0, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: true },
        { id: 'i2', seq: 2, category: '外观', requirement: '形状与简图是否一致', method: '查看图片', sampleCount: 5, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: false },
        { id: 'i3', seq: 3, category: '外观', requirement: '表面喷漆均匀', method: '查看图片', sampleCount: 5, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: true },
        { id: 'i4', seq: 4, category: '标签', requirement: '标签位置正确', method: '查看图片', sampleCount: 5, checkResult: 'OK', result: 'OK', isMandatory: false, isPhotoRequired: false },
        { id: 'i5', seq: 5, category: '包装', requirement: '包装无破损', method: '查看图片', sampleCount: 5, checkResult: 'OK', result: 'OK', isMandatory: true, isPhotoRequired: false },
      ]
    },
    {
      id: 'g2',
      name: '电气柜外观',
      type: 'QUALITATIVE',
      progress: 33,
      status: 'IN_PROGRESS',
      groupResult: 'NONE',
      items: [
        { id: 'i6', seq: 1, category: '接线', requirement: '接线端子紧固', method: '查看图片', sampleCount: 1, result: 'OK', checkResult: 'OK', isMandatory: true, isPhotoRequired: true },
        { id: 'i7', seq: 2, category: '走线', requirement: '走线槽盖板齐全', method: '查看图片', sampleCount: 1, result: 'OK', checkResult: 'OK', isMandatory: true, isPhotoRequired: false },
        { id: 'i8', seq: 3, category: '接地', requirement: '接地标识清晰', method: '查看图片', sampleCount: 1, result: 'OK', checkResult: 'OK', isMandatory: true, isPhotoRequired: false },
      ]
    },
    {
      id: 'g3',
      name: '供收料模块外观',
      type: 'QUALITATIVE',
      progress: 0,
      status: 'PENDING',
      groupResult: 'NONE',
      items: []
    },
    {
      id: 'g4',
      name: '尺寸项目',
      type: 'QUANTITATIVE',
      progress: 0,
      status: 'PENDING',
      groupResult: 'NONE',
      items: [
        { id: 'd1', seq: 1, category: '尺寸', requirement: '内径尺寸 A', method: '游标卡尺', sampleCount: 5, specMin: 90, specMax: 110, measuredValues: ['91', '94', '95', '', ''], result: null, isMandatory: true, isPhotoRequired: false },
        { id: 'd2', seq: 2, category: '尺寸', requirement: '长度 L1', method: '卷尺', sampleCount: 3, specMin: 500, specMax: 505, measuredValues: ['', '', ''], result: null, isMandatory: true, isPhotoRequired: true },
        { id: 'd3', seq: 3, category: '尺寸', requirement: '孔深 D', method: '深度尺', sampleCount: 2, specMin: 10, specMax: 10.5, measuredValues: ['', ''], result: null, isMandatory: true, isPhotoRequired: false },
      ]
    }
  ],
  attachments: [
      { name: '入库检验报告', url: '#', date: '/' },
      { name: '外观缺陷图示.jpg', url: '#', date: '2024-05-01' },
      { name: '尺寸测量记录.pdf', url: '#', date: '2024-05-01' },
  ]
};

// --- Station Collection Mock Data ---

export const MOCK_BOM: BomItem[] = [
    { id: '1', seq: 1, materialCode: '06TVA819SX1CA1', qty: 1, isKeyPart: true, scannedQty: 0, hasDrawing: true },
    { id: '2', seq: 2, materialCode: '2003469823', qty: 1, isKeyPart: true, scannedQty: 0, hasDrawing: true },
    { id: '3', seq: 3, materialCode: '00PSY102414001PT041DOS', qty: 1, isKeyPart: true, scannedQty: 0, hasDrawing: false },
    { id: '4', seq: 4, materialCode: '30XQ0600GLBW', qty: 1, isKeyPart: false, scannedQty: 0, hasDrawing: false },
];

export const MOCK_LOGS: StationLog[] = [
    { id: '1', timestamp: '2025/12/12 8:22:23', type: 'SUCCESS', action: '进站', message: '条码: 232373434 成功!' },
    { id: '2', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '上料', message: '条码: M1200001 不存在，找不到对应的物料号!' },
    { id: '3', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '采集', message: '条码: 232373434 不存在!' },
    { id: '4', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '采集', message: '条码: 232373434 不存在!' },
    { id: '5', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '采集', message: '条码: 232373434 不存在!' },
    { id: '6', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '采集', message: '条码: 232373434 不存在!' },
    { id: '7', timestamp: '2025/12/12 8:22:23', type: 'ERROR', action: '采集', message: '条码: 232373434 不存在!' },
];

export const MOCK_EQUIPMENT: EquipmentItem[] = [
    { 
        id: 'e1', code: 'Equip00000011', name: '立卡设备', type: 'DEVICE', dept: '生产部', status: 'NOT_STARTED',
        checkItems: [{ content: '检查钢丝绳表面：要求目视可见无磨损、无断裂', standard: '文本标签', cycle: '每天', result: null }]
    },
    { 
        id: 'e2', code: 'Gz00000011', name: '工装1', type: 'FIXTURE', dept: '生产部', status: 'NOT_STARTED',
        checkItems: [{ content: '检查吊钩的保险扣，要求无磨损安全可靠', standard: '文本标签', cycle: '每天', result: null }]
    },
    { 
        id: 'e3', code: 'Dj00000011', name: '钢丝绳吊具', type: 'TOOL', dept: '生产部', status: 'NOT_STARTED',
        checkItems: [{ content: '检查控制手柄，要求无磨损，字迹清楚', standard: '文本标签', cycle: '每天', result: null }]
    },
    { 
        id: 'e4', code: 'Dgt00000012', name: '铝合金登高平台（L型护手不...', type: 'TOOL', dept: '生产部', status: 'IN_PROGRESS',
        checkItems: [{ content: '启动行车，观察刹车是否可靠', standard: '文本标签', cycle: '每天', result: null }]
    },
    { 
        id: 'e5', code: 'Dgt00000012', name: '铝合金登高平台（带报警灯）', type: 'TOOL', dept: '生产部', status: 'COMPLETED',
        checkItems: []
    }
];