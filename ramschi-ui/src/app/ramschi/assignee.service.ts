import { Injectable } from '@angular/core';
import { RamschiService } from './ramschi.service';

@Injectable({
  providedIn: 'root',
})
export class AssigneeService {
  private assignees: string[] = [];

  constructor(private readonly service: RamschiService) {
    service.getAssignees().subscribe((assignees) => {
      this.assignees = assignees;
    });
  }

  getAll(): string[] {
    return this.assignees;
  }
}
