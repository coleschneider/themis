import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { Activity } from './activity.entity';
import { Server } from './server.entity';
import { Group } from './group.entity';
import { ActorEntity } from './actor.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    // `name` is the canonical name for the user.
    // Note: the length here is a starting suggestion.
    // Can/should we allow names of arbitrary length?
    @Column('varchar', { length: 32 })
    name: string;

    // `server` is the name of the server the user is on.
    // Mostly, this is for caching purposes.
    @ManyToOne(type => Server, server => server.users, { eager: true })
    server: Server;

    // `displayName` is the "preferred" name for the user.
    @Column('text')
    displayName: string;

    // `summary` is used for profile information, such as a bio or whatever.
    @Column('text')
    summary: string;

    // `icon` is meant to contain a link (URI) to an icon image.
    // This is analagous to forum avatars or Usenet X-Face.
    @Column('text')
    icon: string;

    // `posts` holds a list of all posts this user has made.
    // It's really only used to make the Post relation work.
    @OneToMany(type => Post, post => post.sender)
    posts: Post[];

    // 'activities' is a list of all activities connected to this user.
    // We use it for inbox generation, etc.
    @OneToMany(type => Activity, activity => activity.targetUser)
    activities: Activity[];

    // 'uri' is a unique identifying URI for this group, used in the
    // ActivityPub portion of Themis.
    @Column({ nullable: true })
    uri: string;
    
    // We store the date the user's record was created, mostly for debugging,
    // but also so we can do the "date joined" thing on profile pages.
    @CreateDateColumn({ readonly: true })
    date: string;

    // All posts that this user likes. We store this here instead of on
    // account so that we can turn around and use it on posts, too.
    @ManyToMany(type => Post, post => post.likes)
    @JoinTable()
    liked: Post[];


    /**
     * A list of all users who are following this account.
     *
     * @memberof User
     */
    @ManyToMany(type => User, user => user.userFollowing)
    @JoinTable()
    userFollowers: User[];

    /**
     * A list of all users this account is following.
     *
     * @memberof User
     */
    @ManyToMany(type => User, user => user.userFollowers)
    userFollowing: User[];

    /**
     * A list of all groups following this account.
     *
     * @memberof User
     */
    @ManyToMany(type => Group)
    @JoinTable()
    groupFollowers: Group[];

    /**
     * A list of all groups this account is following.
     *
     * @memberof User
     */
    @ManyToMany(type => Group, group => group.followingUsers)
    @JoinTable()
    groupFollowing: Group[];

    @OneToOne(type => ActorEntity, { cascade: true })
    @JoinColumn()
    actor: ActorEntity;
}