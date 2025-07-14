export class StateTotal {
  constructor(
    public state: string,
    public totalPeople: number,
  ) {}

  addPeople(count: number) {
    this.totalPeople += count;
  }
}
