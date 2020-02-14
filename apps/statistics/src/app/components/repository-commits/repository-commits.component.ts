import { Component, Input, OnInit } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';
import { RefresherService } from '../../services/refresher.service';

const GET_DATA = gql`
  query GetRepoData($owner: String!, $repoName: String!, $since: GitTimestamp!) {
    repository(owner: $owner, name: $repoName) {
      ref(qualifiedName: "master") {
        target {
          ... on Commit {
            id
            history(since: $since) {
              edges {
                node {
                  committedDate
                  additions
                  deletions
                }
              }
            }
          }
        }
      }
    }
  }
`;

export interface PullRequestConnection {
  nodes: PullRequest[];
}

export interface PullRequest {
  mergedAt: string;
}

export interface Edge {
  node: Commit;
}

export interface Author {
  date: string;
}

export interface Repository {
  ref: Ref;
}

export interface Ref {
  target: Commit;
}

export interface RepositoryResult {
  repository: Repository;
}

export interface CommitEdge {
  node: Commit;
}

export interface CommitHistoryConnection {
  edges: CommitEdge[];
}

export interface Commit {
  author: Author;
  committedDate: string;
  history: CommitHistoryConnection;
  additions: number;
  deletions: number;
  associatedPullRequests: PullRequestConnection;
}

@Component({
  selector: 'perun-web-apps-repository-commits',
  templateUrl: './repository-commits.component.html',
  styleUrls: ['./repository-commits.component.scss']
})
export class RepositoryCommitsComponent implements OnInit {

  data: Observable<CommitEdge[]>;

  commitsPerDate: Map<string, number> = new Map<string, number>();
  chartData = [
    { data: [], label: 'Commits' },
  ];

  chartLabels = [];

  @Input()
  daysBack = 7;

  @Input()
  repoOwner = 'CESNET';

  @Input()
  repoName = 'Perun';

  loading = true;

  constructor(
    private apollo: Apollo,
    private refresher: RefresherService,
  ) { }

  fetchData() {
    this.loading = true;
    const sinceDay = this.initMap();

    console.log(sinceDay);

    this.data = this.apollo
      .watchQuery<RepositoryResult>({
        query: GET_DATA,
        variables: {
          owner: this.repoOwner,
          repoName: this.repoName,
          since: sinceDay
        }
      })
      .valueChanges
      .pipe(map(result => {
        console.log(result);
        return result.data.repository.ref.target.history.edges
      }));

    this.data.subscribe(values => {
      values.forEach(e => {
        const date = e.node.committedDate.substring(0, 10);
        this.commitsPerDate.set(date, (this.commitsPerDate.get(date) + 1))
      });
      console.log(this.commitsPerDate);
      this.setCharData();
      this.loading = false;
    });
  }

  ngOnInit() {
   this.fetchData();
   this.refresher.subscribe(() => this.fetchData());
  }

  private initMap(): string {
    this.commitsPerDate = new Map<string, number>();
    let d;
    for (let i = 0; i < this.daysBack; i++) {
      d = new Date();
      d.setDate(d.getDate() - i);
      this.commitsPerDate.set(formatDate(d, 'yyyy-MM-dd', 'en'), 0);
    }
    return formatDate(d, 'yyyy-MM-ddT00:00:00Z', 'en');
  }

  private setCharData() {
    const commitData = new Array<number>();
    const commitLabels = new Array<string>();

    for (let i = 0; i < this.daysBack; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = formatDate(d, 'yyyy-MM-dd', 'en');
      commitData[this.daysBack -i -1] = this.commitsPerDate.get(key);
      commitLabels[this.daysBack -i -1] = key;
    }
    this.chartData[0].data = commitData;
    this.chartLabels = commitLabels;
    console.log(commitData);
  }

}
