interface Visitor {
    visitCompany(company: Company): void;
    visitDepartment(department: Department): void;
    visitEmployee(employee: Employee): void;
}

interface Visitable {
    accept(visitor: Visitor): void;
}

class Employee implements Visitable {
    constructor(public position: string, public salary: number) {}

    accept(visitor: Visitor): void {
        visitor.visitEmployee(this);
    }
}

class Department implements Visitable {
    constructor(public name: string, private employees: Employee[]) {}

    getEmployees(): Employee[] {
        return this.employees;
    }

    accept(visitor: Visitor): void {
        visitor.visitDepartment(this);
        this.employees.forEach(employee => employee.accept(visitor));
    }
}

class Company implements Visitable {
    constructor(public name: string, private departments: Department[]) {}

    getDepartments(): Department[] {
        return this.departments;
    }

    accept(visitor: Visitor): void {
        visitor.visitCompany(this);
        this.departments.forEach(department => department.accept(visitor));
    }
}

class SalaryReportVisitor implements Visitor {
    private report: string[] = [];

    visitCompany(company: Company): void {
        this.report.push(`Salary info for company "${company.name}":`);
    }

    visitDepartment(department: Department): void {
        this.report.push(`Department: ${department.name}`);
    }

    visitEmployee(employee: Employee): void {
        this.report.push(`Position: ${employee.position}, Salary: ${employee.salary}`);
    }

    getReport(): string {
        return this.report.join('\n');
    }
}

// example
const employees1 = [new Employee("Manager", 5000), new Employee("Engineer", 4000)];
const employees2 = [new Employee("Analyst", 4500), new Employee("Engineer", 4800)];

const department1 = new Department("Sales Dept", employees1);
const department2 = new Department("Development Dept", employees2);

const company = new Company("Apple", [department1, department2]);

const salaryReportVisitor = new SalaryReportVisitor();
company.accept(salaryReportVisitor);
console.log(salaryReportVisitor.getReport());
/*
    [LOG]: "Salary info for company "Apple":
    Department: Sales Dept
    Position: Manager, Salary: 5000
    Position: Engineer, Salary: 4000
    Department: Development Dept
    Position: Analyst, Salary: 4500
    Position: Engineer, Salary: 4800" 
 */

const departmentReportVisitor = new SalaryReportVisitor();
department1.accept(departmentReportVisitor);
console.log(departmentReportVisitor.getReport());
/*
    [LOG]: "Department: Sales Dept
    Position: Manager, Salary: 5000
    Position: Engineer, Salary: 4000" 
 */