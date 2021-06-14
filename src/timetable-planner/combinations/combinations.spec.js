import test from 'ava';
import {
  courseMeetingSectionCombinations,
  courseCombinations,
} from './combinations';

const COURSE_L1_P2 = {
  code: 'CSC108H5F',
  meeting_sections: [
    {
      code: 'L0101',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'WEDNESDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'FRIDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
      ],
    },
    {
      code: 'P0101',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 39600,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
    {
      code: 'P0102',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 39600,
          end: 46800,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
  ],
};
const COURSE_L1_T2 = {
  code: 'CSC108H5F',
  meeting_sections: [
    {
      code: 'L0101',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'WEDNESDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'FRIDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
      ],
    },
    {
      code: 'T0101',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 39600,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
    {
      code: 'T0102',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 39600,
          end: 46800,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
  ],
};
const COURSE_L2_T2_P2 = {
  code: 'CSC108H5F',
  meeting_sections: [
    {
      code: 'L0101',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'WEDNESDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'FRIDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
      ],
    },
    {
      code: 'T0101',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 39600,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
    {
      code: 'T0102',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 39600,
          end: 46800,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
    {
      code: 'L0102',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'WEDNESDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
        {
          day: 'FRIDAY',
          start: 32400,
          end: 36000,
          duration: 3600,
          location: 'MN 1270',
        },
      ],
    },
    {
      code: 'P0101',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 32400,
          end: 39600,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
    {
      code: 'P0102',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          start: 39600,
          end: 46800,
          duration: 7200,
          location: 'DH 2010',
        },
      ],
    },
  ],
};
const SECTIONS_L1_P2 = {
  code: 'CSC108H5F',
  combinations: [
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
  ],
};
const SECTIONS_L1_T2 = {
  code: 'CSC108H5F',
  combinations: [
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
  ],
};
const SECTIONS_L2_T2_P2 = {
  code: 'CSC108H5F',
  combinations: [
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
      {
        code: 'CSC108H5FP0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0101',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
      {
        code: 'CSC108H5FP0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0102',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0102',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FP0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0102',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
      {
        code: 'CSC108H5FP0101',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 39600,
            location: 'DH 2010',
            start: 32400,
          },
        ],
      },
    ],
    [
      {
        code: 'CSC108H5FL0102',
        instructors: ['A Petersen'],
        times: [
          {
            day: 'MONDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'WEDNESDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
          {
            day: 'FRIDAY',
            duration: 3600,
            end: 36000,
            location: 'MN 1270',
            start: 32400,
          },
        ],
      },
      {
        code: 'CSC108H5FT0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
      {
        code: 'CSC108H5FP0102',
        instructors: [],
        times: [
          {
            day: 'MONDAY',
            duration: 7200,
            end: 46800,
            location: 'DH 2010',
            start: 39600,
          },
        ],
      },
    ],
  ],
};
const COURSES_SECTION_L1_P2 = [
  [
    {
      code: 'CSC108H5FL0101',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
        {
          day: 'WEDNESDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
        {
          day: 'FRIDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
      ],
    },
    {
      code: 'CSC108H5FP0101',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          duration: 7200,
          end: 39600,
          location: 'DH 2010',
          start: 32400,
        },
      ],
    },
  ],
  [
    {
      code: 'CSC108H5FL0101',
      instructors: ['A Petersen'],
      times: [
        {
          day: 'MONDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
        {
          day: 'WEDNESDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
        {
          day: 'FRIDAY',
          duration: 3600,
          end: 36000,
          location: 'MN 1270',
          start: 32400,
        },
      ],
    },
    {
      code: 'CSC108H5FP0102',
      instructors: [],
      times: [
        {
          day: 'MONDAY',
          duration: 7200,
          end: 46800,
          location: 'DH 2010',
          start: 39600,
        },
      ],
    },
  ],
];
test('Test Course Meeting Section Combinations', async t => {
  const courseMeetingSectionCombosP = courseMeetingSectionCombinations(
    COURSE_L1_P2,
  );
  t.deepEqual(courseMeetingSectionCombosP, SECTIONS_L1_P2);
  const courseMeetingSectionCombosT = courseMeetingSectionCombinations(
    COURSE_L1_T2,
  );
  t.deepEqual(courseMeetingSectionCombosT, SECTIONS_L1_T2);
  const courseMeetingSectionCombosA = courseMeetingSectionCombinations(
    COURSE_L2_T2_P2,
  );
  t.deepEqual(courseMeetingSectionCombosA, SECTIONS_L2_T2_P2);
});
test('Test Course Combination', async t => {
  const courseCombination = courseCombinations([SECTIONS_L1_P2]);
  t.deepEqual(courseCombination, COURSES_SECTION_L1_P2);
});
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluYXRpb25zLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tYmluYXRpb25zL2NvbWJpbmF0aW9ucy5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQTtBQUVyRixNQUFNLFlBQVksR0FBVztJQUN6QixNQUFNLEVBQUUsV0FBVztJQUNuQixrQkFBa0IsRUFBRTtRQUNoQjtZQUNJLE1BQU0sRUFBRSxPQUFPO1lBQ2YsYUFBYSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQzdCLE9BQU8sRUFBRTtnQkFDTDtvQkFDSSxLQUFLLEVBQUUsUUFBUTtvQkFDZixPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsS0FBSztvQkFDWixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsVUFBVSxFQUFFLFNBQVM7aUJBQ3hCLEVBQUU7b0JBQ0MsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLE9BQU8sRUFBRSxLQUFLO29CQUNkLEtBQUssRUFBRSxLQUFLO29CQUNaLFVBQVUsRUFBRSxJQUFJO29CQUNoQixVQUFVLEVBQUUsU0FBUztpQkFDeEIsRUFBRTtvQkFDQyxLQUFLLEVBQUUsUUFBUTtvQkFDZixPQUFPLEVBQUUsS0FBSztvQkFDZCxLQUFLLEVBQUUsS0FBSztvQkFDWixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsVUFBVSxFQUFFLFNBQVM7aUJBQ3hCO2FBQ0o7U0FDSixFQUFFO1lBQ0MsTUFBTSxFQUFFLE9BQU87WUFDZixhQUFhLEVBQUUsRUFBRTtZQUNqQixPQUFPLEVBQUU7Z0JBQ0w7b0JBQ0ksS0FBSyxFQUFFLFFBQVE7b0JBQ2YsT0FBTyxFQUFFLEtBQUs7b0JBQ2QsS0FBSyxFQUFFLEtBQUs7b0JBQ1osVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFVBQVUsRUFBRSxTQUFT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
