import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private logger = new Logger('DatabaseService');

  constructor(
    @InjectDataSource('main_repo')
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    // await this.usersTable();
    // await this.projectTable();
    // await this.projectMemberTable();
    // await this.taskTable();
    // await this.subtaskTable();
    // await this.commentsTable();
    // await this.createIndexes();
  }

  async usersTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id          INT          NOT NULL AUTO_INCREMENT,
          name        VARCHAR(100) NOT NULL,
          username    VARCHAR(150) NOT NULL UNIQUE,
          password    VARCHAR(255) NOT NULL,
          role        ENUM('admin', 'project_manager', 'member', 'viewer') NOT NULL DEFAULT 'member',
          claims      TEXT         NULL,
          created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('users table created successfully');
    } catch (error) {
      this.logger.error('Error creating users table', error);
    }
  }

  async projectTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS projects (
          id          INT          NOT NULL AUTO_INCREMENT,
          title       VARCHAR(150) NOT NULL,
          description TEXT,
          status      ENUM('active', 'archived', 'completed') NOT NULL DEFAULT 'active',
          owner_id    INT          NOT NULL,
          start_date  TIMESTAMP    NULL,
          end_date    TIMESTAMP    NULL,
          created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_project_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE RESTRICT
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('projects table created successfully');
    } catch (error) {
      this.logger.error('Error creating projects table', error);
    }
  }

  async projectMemberTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS project_members (
          id         INT       NOT NULL AUTO_INCREMENT,
          project_id INT       NOT NULL,
          user_id    INT       NOT NULL,
          role       ENUM('project_manager', 'member', 'viewer') NOT NULL DEFAULT 'member',
          joined_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          UNIQUE KEY uq_project_user (project_id, user_id),
          CONSTRAINT fk_pm_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          CONSTRAINT fk_pm_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('project_members table created successfully');
    } catch (error) {
      this.logger.error('Error creating project_members table', error);
    }
  }

  async taskTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS tasks (
          id          INT          NOT NULL AUTO_INCREMENT,
          title       VARCHAR(200) NOT NULL,
          description TEXT,
          status      ENUM('todo', 'in_progress', 'in_review', 'done') NOT NULL DEFAULT 'todo',
          priority    ENUM('low', 'medium', 'high', 'critical')        NOT NULL DEFAULT 'medium',
          project_id  INT          NOT NULL,
          assignee_id INT          NULL,
          created_by  INT          NOT NULL,
          due_date    TIMESTAMP    NULL,
          created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_task_project  FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
          CONSTRAINT fk_task_assignee FOREIGN KEY (assignee_id) REFERENCES users(id)    ON DELETE SET NULL,
          CONSTRAINT fk_task_creator  FOREIGN KEY (created_by)  REFERENCES users(id)    ON DELETE RESTRICT
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('tasks table created successfully');
    } catch (error) {
      this.logger.error('Error creating tasks table', error);
    }
  }

  async subtaskTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS subtasks (
          id         INT          NOT NULL AUTO_INCREMENT,
          task_id    INT          NOT NULL,
          title      VARCHAR(200) NOT NULL,
          status     ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
          created_by INT          NOT NULL,
          created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_subtask_task    FOREIGN KEY (task_id)    REFERENCES tasks(id) ON DELETE CASCADE,
          CONSTRAINT fk_subtask_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('subtasks table created successfully');
    } catch (error) {
      this.logger.error('Error creating subtasks table', error);
    }
  }

  async commentsTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS comments (
          id         INT       NOT NULL AUTO_INCREMENT,
          task_id    INT       NOT NULL,
          user_id    INT       NOT NULL,
          content    TEXT      NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          CONSTRAINT fk_comment_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
          CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
      await this.dataSource.query(query);
      this.logger.log('comments table created successfully');
    } catch (error) {
      this.logger.error('Error creating comments table', error);
    }
  }

  async createIndexes() {
    const indexes = [
      {
        name: 'idx_projects_owner',
        sql: 'ALTER TABLE projects        ADD INDEX idx_projects_owner (owner_id)',
      },
      {
        name: 'idx_pm_project',
        sql: 'ALTER TABLE project_members ADD INDEX idx_pm_project (project_id)',
      },
      {
        name: 'idx_pm_user',
        sql: 'ALTER TABLE project_members ADD INDEX idx_pm_user (user_id)',
      },
      {
        name: 'idx_tasks_project',
        sql: 'ALTER TABLE tasks           ADD INDEX idx_tasks_project (project_id)',
      },
      {
        name: 'idx_tasks_assignee',
        sql: 'ALTER TABLE tasks           ADD INDEX idx_tasks_assignee (assignee_id)',
      },
      {
        name: 'idx_tasks_status',
        sql: 'ALTER TABLE tasks           ADD INDEX idx_tasks_status (status)',
      },
      {
        name: 'idx_subtasks_task',
        sql: 'ALTER TABLE subtasks        ADD INDEX idx_subtasks_task (task_id)',
      },
      {
        name: 'idx_comments_task',
        sql: 'ALTER TABLE comments        ADD INDEX idx_comments_task (task_id)',
      },
      {
        name: 'idx_comments_user',
        sql: 'ALTER TABLE comments        ADD INDEX idx_comments_user (user_id)',
      },
    ];

    for (const index of indexes) {
      try {
        const result: [{ count: number }] = await this.dataSource.query(`
          SELECT COUNT(*) as count
          FROM information_schema.statistics
          WHERE table_schema = DATABASE()
          AND index_name = '${index.name}'
        `);

        if (result[0].count > 0) {
          this.logger.log(`Index ${index.name} already exists, skipping`);
        } else {
          await this.dataSource.query(index.sql);
          this.logger.log(`Index ${index.name} created successfully`);
        }
      } catch (error) {
        this.logger.error(`Error creating index ${index.name}`, error);
      }
    }

    this.logger.log('All indexes processed successfully');
  }
}
