
import { Task, InspectionStatus, InspectionResult, PickingTask, BomItem, EquipmentItem, MaterialCallItem, AsnDeliveryTask } from './types';

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
    woNotes: `Y-INQ-0000024558-1；广西植护元创纸业有限公司40td二氧化氯项目_冰水机；/10KV，不带启动柜，带转换柜：32XRK5APMD0000052DNAM5F_GXZPY(F_GXZPY：安科/瑞模块转换柜)； 需要注意此评审客户不需要启动柜， 已提供对应的审批邮件；/蒸发器接口法兰及对接法兰非标配置PN16承压等级；`,
    techNotes: `HSY;蒸发器/冷凝器：1、铜镍管；2、带压差式流量开关（需要有球阀）；3、水室接管法兰PN16承压；安科瑞模块转换柜：32XRK5APMD0000052DNAM5F_GXZPY； 换热器外协`
  },
  // 设备保养数据
  {
    id: 'AS00000000001',
    deviceCode: 'A0001',
    deviceName: '码垛机XD',
    productCode: 'A0001',
    productName: '码垛机XD',
    line: '(A车间) A产线',
    lineNo: '',
    department: '生产部',
    maintenanceTime: '2024/9/20 19:00',
    maintenancePerson: '钟XX',
    inspector: '钟XX',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-09-20 19:00',
    priority: 'Normal',
    sn: 'N/A',
    isRepaired: false,
    lastMaintenanceSummary: ''
  },
  {
    id: 'AS00000000002',
    deviceCode: 'A0001',
    deviceName: '码垛机XD',
    productCode: 'A0001',
    productName: '码垛机XD',
    line: '(A车间) A产线',
    lineNo: '',
    department: '生产部',
    maintenanceTime: '2024/9/20 19:00',
    maintenancePerson: '2024/9/21 7:00',
    inspector: '2024/9/21 7:00',
    status: InspectionStatus.PENDING,
    result: InspectionResult.NONE,
    createTime: '2024-09-20 19:00',
    priority: 'Normal',
    sn: 'N/A',
    isRepaired: false,
    lastMaintenanceSummary: ''
  }
];

export const MOCK_PICKING_TASKS: PickingTask[] = [
  // 工单 10925375 的全过程 拣配单
  {
    id: 'TO2025120101',
    soNo: '20014049/10',
    woNo: '10925375',
    planDate: '2025-12-10',
    model: '30KAV0800AA',
    status: 'PENDING',
    processCode: '0010',
    processName: 'AC-大件装配',
    workshop: '螺杆车间',
    line: '螺杆1线',
    items: [
      { id: '1', materialCode: '06DPA403844', description: '单通道阀组件', qty: 1, unit: 'EA', sourceLoc: 'A09-100101', admin: '01', isPicked: false },
      { id: '2', materialCode: '09DVG4006601LS', description: '支架组件', qty: 2, unit: 'EA', sourceLoc: 'C01-10', admin: '01', isPicked: false },
      { id: '1-3', materialCode: 'BOLT-M10-50', description: '六角螺栓 M10x50', qty: 20, unit: 'PCS', sourceLoc: 'H01-05', admin: '03', isPicked: false },
      { id: '1-4', materialCode: 'NUT-M10', description: '六角螺母 M10', qty: 20, unit: 'PCS', sourceLoc: 'H01-06', admin: '03', isPicked: false },
      { id: '1-5', materialCode: 'GASKET-RUBBER', description: '橡胶垫片', qty: 4, unit: 'EA', sourceLoc: 'R02-12', admin: '02', isPicked: false },
    ]
  },
  {
    id: 'TO2025120123',
    soNo: '20014049/10',
    woNo: '10925375',
    planDate: '2025-12-10',
    model: '30KAV0800AA',
    status: 'PENDING',
    processCode: '0020',
    processName: 'AC-管配',
    workshop: '螺杆车间',
    line: '螺杆1线',
    items: [
      { id: 'p-1', materialCode: 'CU-PIPE-01', description: '排气铜管组', qty: 1, unit: 'SET', sourceLoc: 'P-01-A', admin: '02', isPicked: false },
      { id: 'p-2', materialCode: 'CU-BEND-01', description: '90度弯头', qty: 4, unit: 'EA', sourceLoc: 'P-01-B', admin: '02', isPicked: false },
      { id: 'p-3', materialCode: 'INSULATION-TUBE', description: '保温管 20mm', qty: 5, unit: 'M', sourceLoc: 'I03-22', admin: '02', isPicked: false },
      { id: 'p-4', materialCode: 'CLAMP-PIPE-25', description: '管夹 25mm', qty: 8, unit: 'EA', sourceLoc: 'H05-11', admin: '03', isPicked: false },
      { id: 'p-5', materialCode: 'VALVE-CHECK', description: '单向阀', qty: 1, unit: 'EA', sourceLoc: 'V04-01', admin: '01', isPicked: false },
    ]
  },
  {
    id: 'TO2025120124',
    soNo: '20014049/10',
    woNo: '10925375',
    planDate: '2025-12-10',
    model: '30KAV0800AA',
    status: 'PENDING',
    processCode: '0030',
    processName: 'AC-钎焊',
    workshop: '螺杆车间',
    line: '螺杆1线',
    items: [
      { id: 'w-1', materialCode: 'WELD-AG-05', description: '银焊条 (5%Ag)', qty: 2, unit: 'KG', sourceLoc: 'W-05', admin: '03', isPicked: false },
      { id: 'w-2', materialCode: 'WELD-FLUX', description: '助焊剂', qty: 1, unit: 'CAN', sourceLoc: 'W-06', admin: '03', isPicked: false },
      { id: 'w-3', materialCode: 'NITROGEN-GAS', description: '氮气 (保护气)', qty: 1, unit: 'CYL', sourceLoc: 'G-01', admin: '06', isPicked: false },
      { id: 'w-4', materialCode: 'SANDPAPER-800', description: '砂纸 800#', qty: 10, unit: 'PCS', sourceLoc: 'T02-05', admin: '03', isPicked: false },
      { id: 'w-5', materialCode: 'GLOVE-WELD', description: '焊工手套', qty: 1, unit: 'PAIR', sourceLoc: 'S09-01', admin: '03', isPicked: false },
    ]
  },
  {
    id: 'TO2025120125',
    soNo: '20014049/10',
    woNo: '10925375',
    planDate: '2025-12-10',
    model: '30KAV0800AA',
    status: 'PENDING',
    processCode: '0035',
    processName: 'AC-V盘预装',
    workshop: '螺杆车间',
    line: '螺杆1线',
    items: [
      { id: 'v-1', materialCode: 'VP-FAN-MOTOR', description: 'V盘风机电机', qty: 2, unit: 'EA', sourceLoc: 'V-01', admin: '04', isPicked: false },
      { id: 'v-2', materialCode: 'VP-BLADE', description: '风机叶片', qty: 2, unit: 'EA', sourceLoc: 'V-02', admin: '04', isPicked: false },
      { id: 'v-3', materialCode: 'VP-GRID-GUARD', description: '风机护网', qty: 2, unit: 'EA', sourceLoc: 'V-04', admin: '04', isPicked: false },
      { id: 'v-4', materialCode: 'SCREW-M6-20', description: '自攻螺丝 M6*20', qty: 24, unit: 'PCS', sourceLoc: 'H02-10', admin: '03', isPicked: false },
      { id: 'v-5', materialCode: 'CABLE-TIE-BLK', description: '黑色扎带', qty: 50, unit: 'PCS', sourceLoc: 'T05-01', admin: '03', isPicked: false },
    ]
  },
  
  // 混合状态数据
  {
    id: 'TO2025120102',
    soNo: '20014140/10',
    woNo: '10925379',
    planDate: '2025-12-10',
    model: '30RB202CPT254',
    status: 'PARTIAL',
    processCode: '0020',
    processName: 'AC-管配',
    workshop: '星火车间',
    line: '星火1线',
    items: [
      { id: '4', materialCode: 'EP71CQ421', description: '球阀', qty: 1, unit: 'EA', sourceLoc: 'C32-050402', admin: '02', isPicked: true, pickedTime: '10:04', assignedCart: 'CART-A01' },
      { id: '5', materialCode: '06TVA819SX1CA1', description: '压缩机减震垫', qty: 4, unit: 'PC', sourceLoc: 'RM01', admin: '02', isPicked: false },
      { id: '5-3', materialCode: 'FLANGE-DN50', description: '法兰 DN50', qty: 2, unit: 'EA', sourceLoc: 'F03-12', admin: '01', isPicked: true, pickedTime: '10:15', assignedCart: 'CART-A01' },
      { id: '5-4', materialCode: 'BOLT-M16-80', description: '螺栓 M16x80', qty: 8, unit: 'PCS', sourceLoc: 'H04-22', admin: '03', isPicked: false },
      { id: '5-5', materialCode: 'GASKET-DN50', description: '密封垫 DN50', qty: 2, unit: 'EA', sourceLoc: 'R01-05', admin: '02', isPicked: false },
    ]
  },
  
  // 已备料 (READ-ONLY DEMO)
  {
    id: 'TO2025120103',
    soNo: '10166253/10',
    woNo: '10920217',
    planDate: '2025-12-10',
    model: '19DV-800-45',
    status: 'READY',
    processCode: '0050',
    processName: 'AC-泵压检测',
    workshop: '离心车间',
    line: '离心1线',
    items: [
      { id: '6', materialCode: '19DV45023701LS', description: '安全阀', qty: 1, unit: 'EA', sourceLoc: 'C31-010402', admin: '05', isPicked: true, pickedTime: '09:13', assignedCart: 'CART-B05' },
      { id: '6-2', materialCode: 'PRESS-GAUGE-01', description: '压力表 0-2.5MPa', qty: 2, unit: 'EA', sourceLoc: 'I01-05', admin: '05', isPicked: true, pickedTime: '09:14', assignedCart: 'CART-B05' },
      { id: '6-3', materialCode: 'CONN-COPPER', description: '铜接头', qty: 4, unit: 'EA', sourceLoc: 'P05-11', admin: '02', isPicked: true, pickedTime: '09:15', assignedCart: 'CART-B05' },
      { id: '6-4', materialCode: 'SEAL-TAPE', description: '生料带', qty: 2, unit: 'ROLL', sourceLoc: 'T01-01', admin: '03', isPicked: true, pickedTime: '09:16', assignedCart: 'CART-B05' },
      { id: '6-5', materialCode: 'VALVE-BALL-1/2', description: '球阀 1/2"', qty: 2, unit: 'EA', sourceLoc: 'V02-10', admin: '01', isPicked: true, pickedTime: '09:18', assignedCart: 'CART-B05' },
    ]
  },

  {
    id: 'TO2025120104',
    soNo: '20014049/20',
    woNo: '10925371',
    planDate: '2025-12-11',
    model: '30XQ0745',
    status: 'PENDING',
    processCode: '0030',
    processName: 'AC-钎焊',
    workshop: '星火车间',
    line: '星火2线',
    items: [
      { id: '7', materialCode: 'KM36BS164', description: '视镜 B', qty: 1, unit: 'EA', sourceLoc: 'C32-050303', admin: '03', isPicked: false },
      { id: '7-2', materialCode: 'SIGHT-GLASS-GSKt', description: '视镜垫片', qty: 2, unit: 'EA', sourceLoc: 'R02-01', admin: '02', isPicked: false },
      { id: '7-3', materialCode: 'FLUX-PASTE', description: '焊膏', qty: 1, unit: 'CAN', sourceLoc: 'W-08', admin: '03', isPicked: false },
      { id: '7-4', materialCode: 'ROD-BCUP-2', description: '磷铜焊条', qty: 3, unit: 'KG', sourceLoc: 'W-02', admin: '03', isPicked: false },
      { id: '7-5', materialCode: 'CLEANING-CLOTH', description: '清洁布', qty: 5, unit: 'PCS', sourceLoc: 'S10-01', admin: '03', isPicked: false },
    ]
  },
  
  // 更多 "已备料" 状态数据以供测试
  {
    id: 'TO2025120115',
    soNo: '20014300/10',
    woNo: '10925390',
    planDate: '2025-12-14',
    model: '30XQ0745',
    status: 'READY',
    processCode: '0060',
    processName: 'AC-真空/接线/加注',
    workshop: '星火车间',
    line: '星火2线',
    items: [
      { id: '19', materialCode: 'OIL-46-SHELL', description: '壳牌46号冷冻油', qty: 1, unit: 'DRUM', sourceLoc: 'OIL-ST', admin: '06', isPicked: true, pickedTime: '15:20', assignedCart: 'CART-C02' },
      { id: '19-2', materialCode: 'VACUUM-OIL', description: '真空泵油', qty: 1, unit: 'L', sourceLoc: 'OIL-02', admin: '06', isPicked: true, pickedTime: '15:21', assignedCart: 'CART-C02' },
      { id: '19-3', materialCode: 'TERM-LUG-50', description: '铜端子 50mm2', qty: 6, unit: 'EA', sourceLoc: 'E05-12', admin: '04', isPicked: true, pickedTime: '15:25', assignedCart: 'CART-C02' },
      { id: '19-4', materialCode: 'SHRINK-TUBE', description: '热缩管', qty: 2, unit: 'M', sourceLoc: 'E06-01', admin: '04', isPicked: true, pickedTime: '15:26', assignedCart: 'CART-C02' },
      { id: '19-5', materialCode: 'LABEL-WARNING', description: '警示标签', qty: 2, unit: 'EA', sourceLoc: 'L01-05', admin: '02', isPicked: true, pickedTime: '15:28', assignedCart: 'CART-C02' },
    ]
  },
];

export const WORKSHOPS = ['星火车间', '螺杆车间', '离心车间'];

export const MOCK_BOM: BomItem[] = [
  { id: '1', seq: 1, materialCode: '06DPA403844', qty: 1, isKeyPart: true, scannedQty: 0, hasDrawing: true },
  { id: '2', seq: 2, materialCode: '09DVG4006601LS', qty: 2, isKeyPart: true, scannedQty: 0, hasDrawing: false },
  { id: '3', seq: 3, materialCode: 'KM36BS163', qty: 1, isKeyPart: false, scannedQty: 0, hasDrawing: true },
  { id: '4', seq: 4, materialCode: 'EP71CQ421', qty: 1, isKeyPart: false, scannedQty: 0, hasDrawing: true },
  { id: '5', seq: 5, materialCode: '06TVA819SX1CA1', qty: 4, isKeyPart: true, scannedQty: 0, hasDrawing: false },
];

export const MOCK_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'E001',
    code: 'EQ-AIR-001',
    name: '气动拧紧枪',
    type: 'TOOL',
    dept: '装配一课',
    status: 'IN_PROGRESS',
    checkItems: [
      { content: '检查气管是否漏气', standard: '无漏气', cycle: '每天', result: 'OK' },
      { content: '检查扭矩是否在设定范围内', standard: '30±2NM', cycle: '每天', result: null }
    ]
  },
  {
    id: 'E002',
    code: 'EQ-CRANE-005',
    name: '电动葫芦/吊钩',
    type: 'DEVICE',
    dept: '起重班',
    status: 'NOT_STARTED',
    checkItems: [
      { content: '检查吊钩的保险扣，要求无磨损安全可靠', standard: '文本标签', cycle: '每天', result: 'NG' }
    ]
  }
];

const generateRandomDate = (startObj: Date, endObj: Date): string => {
  const start = startObj.getTime();
  const end = endObj.getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().split('T')[0];
};

const startDate = new Date('2026-04-20');
const endDate = new Date('2026-05-05');

const ADMINS_LIST = ['01', '02', '03', '04', '05', '06', '07'];
const TARGET_LOCS_LIST = ['4C', 'IDU', 'M', 'A3', '02MV', '05K', '06DE', '06N'];

const MOCK_MATERIAL_CALLS_BASE: MaterialCallItem[] = [
  {
    id: 'MC-20260420-001',
    woNo: 'WO-10907558',
    planDate: '2026-04-20',
    materialCode: 'MAT-8001',
    description: '冷凝器风扇电机',
    model: '30XQ0600GLBW',
    admin: '01',
    sourceLoc: 'A1-02-01',
    virtualFlag: '否',
    targetLoc: '4C',
    qty: 24,
    pickedQty: 0,
    remarks: '加急',
    status: 'PENDING'
  },
  {
    id: 'MC-20260422-002',
    woNo: 'WO-10907558',
    planDate: '2026-04-22',
    materialCode: 'MAT-8002',
    description: '压缩机减震垫',
    model: '06TVA819',
    admin: '02',
    sourceLoc: 'B3-01-02',
    virtualFlag: '是',
    targetLoc: 'IDU',
    qty: 100,
    pickedQty: 20,
    remarks: '',
    status: 'PARTIAL'
  },
  {
    id: 'MC-20260425-003',
    woNo: 'WO-10907559',
    planDate: '2026-04-25',
    materialCode: 'MAT-8003',
    description: '冷水机控制器',
    model: 'CTRL-V2',
    admin: '03',
    sourceLoc: 'C1-01',
    virtualFlag: '否',
    targetLoc: 'M',
    qty: 5,
    pickedQty: 5,
    remarks: '需校验程序',
    status: 'COMPLETED'
  }
];

const generateMoreCalls = (count: number): MaterialCallItem[] => {
  const results: MaterialCallItem[] = [];
  const sourceLocs = ['A1-02-01', 'B3-01-02', 'C1-01', 'D2-04-01', 'E5-02-05', 'F-R01-01'];
  const descs = ['冷凝器风扇电机', '压缩机减震垫', '冷水机控制器', '电子膨胀阀', '冷媒过滤器', '水温传感器', '高压开关', '接线端子排', '导热硅脂', '固定支架', '离心压力阀', '触摸屏总成'];
  const models = ['30XQ0600', '06TVA819', 'CTRL-V2', 'EXV-001', 'FIL-10A', 'WTS-500', 'HPS-30', 'TB-012', 'TP-01', 'FB-100', 'CPV-002', 'TS-10'];

  for (let i = 0; i < count; i++) {
    const qty = Math.floor(Math.random() * 200) + 10;
    const pickedQty = i % 4 === 0 ? qty : (i % 2 === 0 ? Math.floor(qty / 3) : 0);
    const status = pickedQty === qty ? 'COMPLETED' : (pickedQty === 0 ? 'PENDING' : 'PARTIAL');
    const descIndex = i % descs.length;

    results.push({
      id: `MC-202604-${(i + 4).toString().padStart(3, '0')}`,
      woNo: `WO-1090${7600 + i}`,
      planDate: generateRandomDate(startDate, endDate),
      materialCode: `MAT-9${(i + 1).toString().padStart(3, '0')}`,
      description: descs[descIndex],
      model: models[descIndex],
      admin: ADMINS_LIST[i % ADMINS_LIST.length],
      sourceLoc: sourceLocs[i % sourceLocs.length],
      virtualFlag: i % 5 === 0 ? '是' : '否',
      targetLoc: TARGET_LOCS_LIST[i % TARGET_LOCS_LIST.length],
      qty: qty,
      pickedQty: pickedQty,
      remarks: i % 7 === 0 ? '加急调拨' : (i % 11 === 0 ? '缺货需催交' : ''),
      status: status
    });
  }
  return results;
};

export const MOCK_MATERIAL_CALLS: MaterialCallItem[] = [
  ...MOCK_MATERIAL_CALLS_BASE,
  ...generateMoreCalls(30)
];

export const MOCK_ASN_DELIVERY_TASKS: AsnDeliveryTask[] = [
  {
    id: 'ASN-20260420-001',
    picker: '王建国',
    status: 'UNPRINTED',
    itemCount: 15,
    cart: 'C-010',
    inventoryLoc: 'W-01',
    pickingTime: '2026-04-20 08:30:00',
    sourceLoc: 'A区-原料仓',
    targetLoc: 'S1-车间产线仓',
    items: [
      { id: '1', materialCode: 'MAT-8001', description: '冷凝器风扇电机', qty: 5, unit: 'SET', sourceLoc: 'A1-02-01', admin: '01', isPicked: true, pickedTime: '2026-04-20 08:15' },
      { id: '2', materialCode: 'MAT-8002', description: '压缩机减震垫', qty: 10, unit: 'PC', sourceLoc: 'B3-01-02', admin: '02', isPicked: true, pickedTime: '2026-04-20 08:20' }
    ]
  },
  {
    id: 'ASN-20260421-002',
    picker: '李大伟',
    status: 'PRINTED',
    itemCount: 42,
    cart: 'C-015',
    inventoryLoc: 'W-02',
    pickingTime: '2026-04-21 14:20:00',
    sourceLoc: 'B区-半成品仓',
    targetLoc: 'S2-装配线仓',
    items: [
      { id: '3', materialCode: 'MAT-8003', description: '冷水机控制器', qty: 2, unit: 'SET', sourceLoc: 'C1-01', admin: '03', isPicked: true, pickedTime: '2026-04-21 14:10' }
    ]
  },
  {
    id: 'ASN-20260422-003',
    picker: '张小强',
    status: 'UNPRINTED',
    itemCount: 8,
    cart: 'C-022',
    inventoryLoc: 'W-03',
    pickingTime: '2026-04-22 09:15:00',
    sourceLoc: 'A区-原料仓',
    targetLoc: 'S1-车间产线仓'
  },
  {
    id: 'ASN-20260425-004',
    picker: '赵明',
    status: 'PRINTED',
    itemCount: 120,
    cart: 'C-005',
    inventoryLoc: 'W-01',
    pickingTime: '2026-04-25 16:45:00',
    sourceLoc: 'C区-成品仓',
    targetLoc: 'SAP-虚拟仓'
  }
];
