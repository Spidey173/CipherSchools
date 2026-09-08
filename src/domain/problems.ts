import type { Problem } from './types';

export const PROBLEMS: Problem[] = [
  {
    id: 'parking-lot',
    title: 'Design a Multi-Level Parking Lot',
    tagline: 'Classic object-oriented domain design problem testing hierarchies, slot allocation, and fee strategies.',
    difficulty: 'Medium',
    estimatedTimeMin: 45,
    tags: ['Creational Patterns', 'Strategy Pattern', 'State Management'],
    description: `Design a system for a multi-floor parking lot that can accommodate multiple vehicle types (Motorcycle, Car, Bus/Truck). The system must assign tickets, allocate the nearest available spot, calculate fees based on duration and vehicle type, and process payment upon exit.`,
    expectedClasses: [
      'Vehicle',
      'Car',
      'Motorcycle',
      'Truck',
      'ParkingSpot',
      'ParkingFloor',
      'ParkingLot',
      'Ticket',
      'ParkingFeeStrategy'
    ],
    coreRequirements: [
      {
        id: 'req-1',
        title: 'Vehicle Type Hierarchy',
        description: 'Support different vehicle types (Motorcycle, Car, Truck) with varying spot size requirements.',
        type: 'functional',
        keyEntities: ['Vehicle', 'VehicleType', 'SpotType']
      },
      {
        id: 'req-2',
        title: 'Multi-Floor Spot Allocation',
        description: 'Multiple floors with individual spots. Locate and park in the optimal/nearest available spot.',
        type: 'functional',
        keyEntities: ['ParkingFloor', 'ParkingSpot', 'ParkingLot']
      },
      {
        id: 'req-3',
        title: 'Ticketing & Time Tracking',
        description: 'Issue a unique ticket on vehicle entry containing entry time, slot info, and vehicle registration.',
        type: 'functional',
        keyEntities: ['Ticket']
      },
      {
        id: 'req-4',
        title: 'Extensible Fee Calculation Strategy',
        description: 'Calculate parking charges dynamically using custom strategies (Flat rate, Hourly, Surge/Weekend pricing).',
        type: 'functional',
        keyEntities: ['PricingStrategy', 'FeeCalculator']
      },
      {
        id: 'req-5',
        title: 'Thread Safety & Concurrency Consideration',
        description: 'Prevent two vehicles from occupying the same spot during simultaneous gate entries.',
        type: 'non-functional',
        keyEntities: ['Concurrency', 'Locking / Atomic operations']
      }
    ],
    starterCode: {
      language: 'typescript',
      code: `// Define your LLD for Parking Lot here:
// Hint: Think about Entities, Enums, Interfaces, and Classes.

export enum VehicleType {
  MOTORCYCLE,
  CAR,
  TRUCK
}

export abstract class Vehicle {
  constructor(
    public licensePlate: string,
    public type: VehicleType
  ) {}
}

export class Car extends Vehicle {
  constructor(licensePlate: string) {
    super(licensePlate, VehicleType.CAR);
  }
}

// TODO: Implement ParkingSpot, ParkingFloor, Ticket, PricingStrategy, and ParkingLot
export class ParkingLot {
  // Implement singleton or facade methods
}
`
    },
    sampleSolution: {
      language: 'typescript',
      code: `// Reference Design Pattern implementation for Parking Lot
export enum VehicleType { MOTORCYCLE, CAR, TRUCK }
export enum SpotType { COMPACT, REGULAR, LARGE }

export abstract class Vehicle {
  constructor(public readonly licensePlate: string, public readonly type: VehicleType) {}
}

export class Car extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.CAR); }
}

export class Motorcycle extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.MOTORCYCLE); }
}

export class Truck extends Vehicle {
  constructor(plate: string) { super(plate, VehicleType.TRUCK); }
}

export class ParkingSpot {
  private occupiedVehicle: Vehicle | null = null;
  constructor(public readonly spotId: string, public readonly spotType: SpotType) {}

  public isAvailable(): boolean {
    return this.occupiedVehicle === null;
  }

  public canFitVehicle(vehicle: Vehicle): boolean {
    if (vehicle.type === VehicleType.MOTORCYCLE) return true;
    if (vehicle.type === VehicleType.CAR) return this.spotType === SpotType.REGULAR || this.spotType === SpotType.LARGE;
    if (vehicle.type === VehicleType.TRUCK) return this.spotType === SpotType.LARGE;
    return false;
  }

  public assignVehicle(vehicle: Vehicle): boolean {
    if (!this.isAvailable() || !this.canFitVehicle(vehicle)) return false;
    this.occupiedVehicle = vehicle;
    return true;
  }

  public vacate(): void {
    this.occupiedVehicle = null;
  }
}

export class ParkingFloor {
  constructor(public readonly floorNumber: number, public readonly spots: ParkingSpot[]) {}

  public findAvailableSpot(vehicle: Vehicle): ParkingSpot | null {
    return this.spots.find(s => s.isAvailable() && s.canFitVehicle(vehicle)) || null;
  }
}

export class Ticket {
  constructor(
    public readonly ticketNumber: string,
    public readonly vehicle: Vehicle,
    public readonly spot: ParkingSpot,
    public readonly entryTime: Date = new Date()
  ) {}
}

export interface PricingStrategy {
  calculateFee(ticket: Ticket, exitTime: Date): number;
}

export class HourlyPricingStrategy implements PricingStrategy {
  constructor(private hourlyRates: Record<VehicleType, number>) {}
  calculateFee(ticket: Ticket, exitTime: Date): number {
    const hours = Math.max(1, Math.ceil((exitTime.getTime() - ticket.entryTime.getTime()) / (1000 * 60 * 60)));
    return hours * (this.hourlyRates[ticket.vehicle.type] || 20);
  }
}

export class ParkingLot {
  private static instance: ParkingLot;
  private floors: ParkingFloor[] = [];
  private activeTickets: Map<string, Ticket> = new Map();
  private pricingStrategy: PricingStrategy;

  private constructor(pricingStrategy: PricingStrategy) {
    this.pricingStrategy = pricingStrategy;
  }

  public static getInstance(pricingStrategy: PricingStrategy): ParkingLot {
    if (!ParkingLot.instance) {
      ParkingLot.instance = new ParkingLot(pricingStrategy);
    }
    return ParkingLot.instance;
  }

  public addFloor(floor: ParkingFloor): void {
    this.floors.push(floor);
  }

  public parkVehicle(vehicle: Vehicle): Ticket | null {
    for (const floor of this.floors) {
      const spot = floor.findAvailableSpot(vehicle);
      if (spot && spot.assignVehicle(vehicle)) {
        const ticket = new Ticket(\`TKT-\${Date.now()}-\${vehicle.licensePlate}\`, vehicle, spot);
        this.activeTickets.set(ticket.ticketNumber, ticket);
        return ticket;
      }
    }
    return null;
  }

  public checkout(ticketNumber: string, exitTime: Date = new Date()): number {
    const ticket = this.activeTickets.get(ticketNumber);
    if (!ticket) throw new Error("Invalid ticket");
    const fee = this.pricingStrategy.calculateFee(ticket, exitTime);
    ticket.spot.vacate();
    this.activeTickets.delete(ticketNumber);
    return fee;
  }
}`,
      explanation: 'Uses Strategy Pattern for fee calculation (Open/Closed Principle), Singleton Pattern for ParkingLot coordinator, clear encapsulation in ParkingSpot, and polymorphism in Vehicle types.'
    },
    keyDesignQuestions: [
      'How do you isolate the pricing algorithm so new discount/surge rules do not modify ParkingLot class?',
      'Who is responsible for determining if a vehicle fits in a spot: Vehicle or ParkingSpot?',
      'How does your design handle concurrent spot reservation?'
    ]
  },
  {
    id: 'elevator-system',
    title: 'Design an Elevator System',
    tagline: 'State machine, scheduling algorithms (LOOK/SCAN), and real-time dispatcher design.',
    difficulty: 'Hard',
    estimatedTimeMin: 50,
    tags: ['State Pattern', 'Observer Pattern', 'Scheduling Algorithm'],
    description: `Design an Elevator controller system managing N elevators in an M-story building. The system should handle internal requests (passengers pressing buttons inside the car) and external hall calls (passengers waiting on floors pressing UP/DOWN).`,
    expectedClasses: [
      'Elevator',
      'ElevatorController',
      'InternalButton',
      'ExternalButton',
      'Dispatcher',
      'Direction',
      'ElevatorState'
    ],
    coreRequirements: [
      {
        id: 'el-1',
        title: 'Elevator Motion & State Management',
        description: 'Elevator transitions cleanly between MOVING_UP, MOVING_DOWN, IDLE, and DOORS_OPEN.',
        type: 'functional',
        keyEntities: ['ElevatorState', 'Elevator']
      },
      {
        id: 'el-2',
        title: 'Optimal Dispatching Strategy',
        description: 'Assign the best elevator for an external hall call to minimize passenger wait time.',
        type: 'functional',
        keyEntities: ['DispatcherStrategy', 'ElevatorController']
      },
      {
        id: 'el-3',
        title: 'Request Handling & Queuing',
        description: 'Maintain and process requests in the current direction before reversing (LOOK/SCAN algorithm).',
        type: 'functional',
        keyEntities: ['RequestQueue', 'FloorRequest']
      }
    ],
    starterCode: {
      language: 'typescript',
      code: `// Design Elevator Controller System
export enum Direction { UP, DOWN, IDLE }
export enum ElevatorStatus { MOVING, STOPPED, MAINTENANCE }

export class Request {
  constructor(public floor: number, public direction: Direction) {}
}

export class Elevator {
  public id: number;
  public currentFloor: number = 0;
  public direction: Direction = Direction.IDLE;
  // TODO: Add state, doors, and movement lifecycle
}

export class ElevatorController {
  // TODO: Dispatcher and scheduling algorithm (e.g. SCAN / LOOK)
}
`
    },
    sampleSolution: {
      language: 'typescript',
      code: `// Reference Design for Elevator System with State & Strategy
export enum Direction { UP = 'UP', DOWN = 'DOWN', IDLE = 'IDLE' }
export enum DoorState { OPEN = 'OPEN', CLOSED = 'CLOSED' }

export interface ElevatorObserver {
  onFloorReached(elevatorId: number, floor: number): void;
}

export class Elevator {
  public currentFloor: number = 1;
  public direction: Direction = Direction.IDLE;
  public doorState: DoorState = DoorState.CLOSED;
  private upStops: Set<number> = new Set();
  private downStops: Set<number> = new Set();

  constructor(public readonly id: number, private observer?: ElevatorObserver) {}

  public addInternalRequest(floor: number): void {
    if (floor > this.currentFloor) {
      this.upStops.add(floor);
      if (this.direction === Direction.IDLE) this.direction = Direction.UP;
    } else if (floor < this.currentFloor) {
      this.downStops.add(floor);
      if (this.direction === Direction.IDLE) this.direction = Direction.DOWN;
    }
  }

  public step(): void {
    if (this.direction === Direction.UP) {
      this.currentFloor++;
      if (this.upStops.has(this.currentFloor)) {
        this.upStops.delete(this.currentFloor);
        this.openDoors();
      }
      if (this.upStops.size === 0) {
        this.direction = this.downStops.size > 0 ? Direction.DOWN : Direction.IDLE;
      }
    } else if (this.direction === Direction.DOWN) {
      this.currentFloor--;
      if (this.downStops.has(this.currentFloor)) {
        this.downStops.delete(this.currentFloor);
        this.openDoors();
      }
      if (this.downStops.size === 0) {
        this.direction = this.upStops.size > 0 ? Direction.UP : Direction.IDLE;
      }
    }
  }

  private openDoors(): void {
    this.doorState = DoorState.OPEN;
    if (this.observer) this.observer.onFloorReached(this.id, this.currentFloor);
  }

  public closeDoors(): void {
    this.doorState = DoorState.CLOSED;
  }
}

export interface DispatcherStrategy {
  selectElevator(elevators: Elevator[], floor: number, direction: Direction): Elevator;
}

export class ProximityDispatcher implements DispatcherStrategy {
  selectElevator(elevators: Elevator[], floor: number, direction: Direction): Elevator {
    return elevators.reduce((closest, el) => {
      const distance = Math.abs(el.currentFloor - floor);
      const closestDistance = Math.abs(closest.currentFloor - floor);
      return distance < closestDistance ? el : closest;
    }, elevators[0]);
  }
}

export class ElevatorSystem {
  private elevators: Elevator[] = [];
  constructor(elevatorCount: number, private dispatcher: DispatcherStrategy) {
    for (let i = 1; i <= elevatorCount; i++) {
      this.elevators.push(new Elevator(i));
    }
  }

  public pressHallButton(floor: number, direction: Direction): void {
    const selected = this.dispatcher.selectElevator(this.elevators, floor, direction);
    selected.addInternalRequest(floor);
  }
}`,
      explanation: 'Applies Strategy pattern for floor dispatching, encapsulates state transitions cleanly inside Elevator, and separates Hall calls from car internals.'
    },
    keyDesignQuestions: [
      'How to decouple the scheduling algorithm (e.g., LOOK vs FCFS) from the elevator motor execution?',
      'How does the system ensure starvation-free scheduling when multiple calls arrive continuously?'
    ]
  },
  {
    id: 'vending-machine',
    title: 'Design a Vending Machine',
    tagline: 'State pattern flagship problem: Idle, ReadyForCoins, Dispense, SoldOut, and Coin Refund.',
    difficulty: 'Easy',
    estimatedTimeMin: 35,
    tags: ['State Pattern', 'Inventory Management', 'Coin Dispenser'],
    description: `Design an automated snack and beverage vending machine. It must accept cash/coins, track inventory, allow users to select products, validate funds, dispense items and return change, while cleanly handling edge cases like sold-out products and refunds.`,
    expectedClasses: [
      'VendingMachine',
      'VendingMachineState',
      'IdleState',
      'HasMoneyState',
      'DispensingState',
      'Item',
      'Inventory',
      'Coin'
    ],
    coreRequirements: [
      {
        id: 'vm-1',
        title: 'State Machine Transitions',
        description: 'Manage lifecycle: NoCoin/Idle -> HasCoin -> SelectionMade -> Dispense -> Refund/ReturnChange.',
        type: 'functional',
        keyEntities: ['VendingMachineState', 'IdleState', 'HasMoneyState', 'DispenseState']
      },
      {
        id: 'vm-2',
        title: 'Inventory & Stock Management',
        description: 'Track item quantities and prevent dispensing when an item is out of stock.',
        type: 'functional',
        keyEntities: ['Inventory', 'Item']
      },
      {
        id: 'vm-3',
        title: 'Coin & Change Return Calculation',
        description: 'Verify inserted coins match or exceed item price and dispense optimal change.',
        type: 'functional',
        keyEntities: ['CoinHandler', 'ChangeCalculator']
      }
    ],
    starterCode: {
      language: 'typescript',
      code: `// Design Vending Machine using State Pattern
export interface State {
  insertCoin(amount: number): void;
  selectItem(code: string): void;
  dispense(): void;
  cancel(): void;
}

export class VendingMachine {
  private currentState: State;
  // TODO: Add Inventory, Balance, and Concrete States
}
`
    },
    sampleSolution: {
      language: 'typescript',
      code: `// Clean State Pattern Vending Machine
export class Item {
  constructor(public code: string, public name: string, public price: number) {}
}

export class Inventory {
  private stock: Map<string, { item: Item; count: number }> = new Map();

  public addItem(item: Item, count: number): void {
    this.stock.set(item.code, { item, count });
  }

  public getItem(code: string): Item | null {
    return this.stock.get(code)?.item || null;
  }

  public isAvailable(code: string): boolean {
    const entry = this.stock.get(code);
    return entry !== undefined && entry.count > 0;
  }

  public deduct(code: string): void {
    const entry = this.stock.get(code);
    if (entry && entry.count > 0) entry.count--;
  }
}

export interface MachineState {
  insertCoin(amount: number): void;
  selectProduct(code: string): void;
  dispense(): void;
  refund(): number;
}

export class VendingMachine {
  public inventory = new Inventory();
  public balance = 0;
  public selectedCode: string | null = null;
  public state: MachineState;

  constructor() {
    this.state = new IdleState(this);
  }

  public setState(state: MachineState): void {
    this.state = state;
  }
}

export class IdleState implements MachineState {
  constructor(private machine: VendingMachine) {}
  insertCoin(amount: number): void {
    this.machine.balance += amount;
    this.machine.setState(new HasMoneyState(this.machine));
  }
  selectProduct(): void { throw new Error("Insert money first."); }
  dispense(): void { throw new Error("No product selected."); }
  refund(): number { return 0; }
}

export class HasMoneyState implements MachineState {
  constructor(private machine: VendingMachine) {}
  insertCoin(amount: number): void {
    this.machine.balance += amount;
  }
  selectProduct(code: string): void {
    if (!this.machine.inventory.isAvailable(code)) throw new Error("Item out of stock");
    const item = this.machine.inventory.getItem(code)!;
    if (this.machine.balance < item.price) throw new Error("Insufficient funds");
    this.machine.selectedCode = code;
    this.machine.setState(new DispensingState(this.machine));
  }
  dispense(): void { throw new Error("Select product first"); }
  refund(): number {
    const change = this.machine.balance;
    this.machine.balance = 0;
    this.machine.setState(new IdleState(this.machine));
    return change;
  }
}

export class DispensingState implements MachineState {
  constructor(private machine: VendingMachine) {}
  insertCoin(): void { throw new Error("Dispensing in progress"); }
  selectProduct(): void { throw new Error("Dispensing in progress"); }
  dispense(): void {
    const code = this.machine.selectedCode!;
    const item = this.machine.inventory.getItem(code)!;
    this.machine.inventory.deduct(code);
    this.machine.balance -= item.price;
    this.machine.selectedCode = null;
    this.machine.setState(this.machine.balance > 0 ? new HasMoneyState(this.machine) : new IdleState(this.machine));
  }
  refund(): number { throw new Error("Cannot refund during dispense"); }
}`,
      explanation: 'Textbook implementation of State Design Pattern avoiding spaghetti if-else chains, clean state transitions, and distinct inventory management.'
    },
    keyDesignQuestions: [
      'Why is the State Pattern preferred over switch-case statements for Vending Machine?',
      'How does your design handle concurrent money insertion or refund requests?'
    ]
  }
];
