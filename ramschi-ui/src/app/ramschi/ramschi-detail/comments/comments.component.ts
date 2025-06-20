import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  CredentialService,
  RoleAware,
} from '../../../login/credential.service';
import { IComment } from '../../domain';
import { SpinnerService } from '../../../spinner.service';
import { RamschiService } from '../../ramschi.service';

@Component({
  selector: 'app-comments',
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent extends RoleAware {
  @Input()
  comments: IComment[] = [];

  @Input()
  itemId: string | null = null;

  @ViewChild('newCommentTextArea')
  newCommentElement!: ElementRef<HTMLTextAreaElement>;

  newComment = '';

  constructor(
    private readonly service: RamschiService,
    private readonly spinner: SpinnerService,
    credential: CredentialService,
  ) {
    super(credential);
  }

  saveNewComment(): void {
    this.spinner.show();
    this.service
      .postComment({
        id: null,
        itemId: this.itemId!,
        author: this.credential.getAssignee()!,
        text: this.newComment,
        lastEdit: undefined,
      })
      .subscribe((comment) => {
        this.spinner.hide();
        this.newComment = '';
        this.comments.push(comment);
      });
  }

  deleteComment(comment: IComment): void {
    if (confirm('Kommentar wirklich löschen?')) {
      this.spinner.show();
      this.service.deleteComment(comment.id!).subscribe(() => {
        const index = this.comments.indexOf(comment);
        this.comments.splice(index, 1);
        this.spinner.hide();
      });
    }
  }

  adjustNewCommentHeight() {
    const element = this.newCommentElement.nativeElement;
    element.style.height = element.scrollHeight + 'px';
  }
}
