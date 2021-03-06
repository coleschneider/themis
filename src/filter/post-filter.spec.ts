import { PostFilter, FilterProperty } from './post-filter';
import { Post } from '../entities/post.entity';

describe('PostFilter', () => {
  let provider: PostFilter;
  
  beforeAll(async () => {
    provider = new PostFilter([]);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('Parsing filter entries', () => {

    it('should be called on a defined object', () => {
      expect(provider).toBeDefined();
    });

    it('should result in a defined function', () => {
      const theFilter = provider.filterFromEntry({
        property: 'subject' as FilterProperty,
        relation: 'equals',
        target: 'foo'
      });

      expect(theFilter).toBeDefined();
      expect(theFilter).toBeInstanceOf(Function);
    });

    it('should throw on an invalid relation', () => {
      expect(() => provider.filterFromEntry({
        property: 'subject',
        relation: 'invalid',
        target: ''
      })).toThrow();
    });

    it('should correctly filter entries', () => {
      const filterFunction = provider.filterFromEntry({
        property: 'subject',
        relation: 'equals',
        target: 'foo'
      });

      const testData = Array.from({length: 5}, (_, i) => {
        const p = new Post();
        p.id = i;
        p.subject = (i % 2) ? 'foo' : 'bar';
        return p;
      });

      const result = testData.filter(filterFunction);

      expect(result).toBeDefined();
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual(1);
    });

    // it('should apply successive filters on a collection of Post entities', () => {
    //   const names = ['foo', 'bar', 'test', 'whatever', 'something'];
    //   const servers = ['example.com', 'example.com', 'example.com', 'host.local', 'example.invalid'];

    //   const testData = names.map((v, i) => {
    //     const p = new Post();
    //     p.id = i;
    //     p.subject = v;
    //     p.server = { host: servers[i]} as Server;
    //     return p;
    //   });

    //   const filterFunctions = [
    //     { property: 'subject' as FilterProperty, relation: 'contains', target: 'a' },
    //     { property: 'server' as FilterProperty, relation: 'endsWith', target: 'com' }
    //   ];

    //   const postFilter = new PostFilter(filterFunctions);

    //   const result = postFilter.execute(testData);

    //   expect(result).toBeDefined();
    //   expect(result).toHaveLength(1);
    //   expect(result[0].id).toEqual(4);
    //   expect(result[0].server).toEqual('example.invalid');
    // });
  });
});
