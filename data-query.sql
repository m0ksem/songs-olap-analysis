 WITH [ClassifiedSongVariantDim]
     AS (SELECT [SongVariantDim].[id],
                CASE
                  WHEN Avg([PlayRecordFact].[complete_percent]) >= 60 THEN
                  'easy'
                  WHEN Avg([PlayRecordFact].[complete_percent]) >= 33 THEN 'mid'
                  ELSE 'hard'
                END AS [song_level]
         FROM   [PlayRecordFact]
                INNER JOIN [SongVariantDim]
                        ON [PlayRecordFact].[song_variant] =
                           [SongVariantDim].[id]
         GROUP  BY [SongVariantDim].[id])
SELECT *
FROM   (SELECT [SongDim].[genre],
               [SongVariantDim].[open_notes],
               [SongVariantDim].[muted_notes],
               [SongVariantDim].[bpm],
               [ClassifiedSongVariantDim].[song_level]
        FROM   [PlayRecordFact]
               INNER JOIN [SongVariantDim]
                       ON [PlayRecordFact].[song_variant] =
                          [SongVariantDim].[id]
               INNER JOIN [SongDim]
                       ON [SongVariantDim].[song] = [SongDim].[id]
               INNER JOIN [ClassifiedSongVariantDim]
                       ON [ClassifiedSongVariantDim].[id] =
                          [SongVariantDim].[id]) AS
       [player_levels_table]
GROUP  BY [song_level],
          [player_levels_table].[genre],
          [player_levels_table].[open_notes],
          [player_levels_table].[muted_notes],
          [player_levels_table].[bpm]  