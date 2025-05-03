import { Component, OnInit } from '@angular/core';
import { RamschiService } from '../ramschi.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  assignees: string[] = [];

  newAssignee: string | null = null;

  constructor (private readonly service: RamschiService) {}

  ngOnInit(): void {
    this.refresh();
  }

  createNewAssignee(): void {
    this.service.postAssignee(this.newAssignee!).subscribe(() => {
      this.newAssignee = null;
      this.refresh();
    });
  }

  deleteAssignee(name: string) {
    if (confirm(name + ' löschen?')) {
      this.service.deleteAssignee(name).subscribe(() => {
        this.refresh();
      });
    }
  }

  private refresh() {
    this.service.getAssignees().subscribe(assignees => this.assignees = assignees);
  }

}
