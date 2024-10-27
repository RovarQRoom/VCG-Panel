export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			Card: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					icon: string | null;
					id: number;
					link: string | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					icon?: string | null;
					id?: number;
					link?: string | null;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					icon?: string | null;
					id?: number;
					link?: string | null;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Card_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Card_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Carousel: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					media: number | null;
					title: number;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					title: number;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					media?: number | null;
					title?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'Carousel_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Carousel_media_fkey';
						columns: ['media'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Carousel_title_fkey';
						columns: ['title'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Event: {
				Row: {
					created_at: string;
					date: string;
					deleted_at: string | null;
					id: number;
					place: number;
					ticket: string | null;
				};
				Insert: {
					created_at?: string;
					date: string;
					deleted_at?: string | null;
					id?: number;
					place: number;
					ticket?: string | null;
				};
				Update: {
					created_at?: string;
					date?: string;
					deleted_at?: string | null;
					id?: number;
					place?: number;
					ticket?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Event_place_fkey';
						columns: ['place'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
			Footer: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					id: number;
					phones: string[] | null;
					socials: string[] | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					phones?: string[] | null;
					socials?: string[] | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					id?: number;
					phones?: string[] | null;
					socials?: string[] | null;
				};
				Relationships: [];
			};
			Language: {
				Row: {
					ar: string | null;
					ckb: string | null;
					created_at: string;
					deleted_at: string | null;
					en: string;
					id: number;
				};
				Insert: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en: string;
					id?: number;
				};
				Update: {
					ar?: string | null;
					ckb?: string | null;
					created_at?: string;
					deleted_at?: string | null;
					en?: string;
					id?: number;
				};
				Relationships: [];
			};
			Register: {
				Row: {
					action: boolean | null;
					created_at: string;
					deleted_at: string | null;
					email: string;
					id: number;
					language: Database['public']['Enums']['LanguageEnum'];
					name: string;
					phone: string;
				};
				Insert: {
					action?: boolean | null;
					created_at?: string;
					deleted_at?: string | null;
					email: string;
					id?: number;
					language?: Database['public']['Enums']['LanguageEnum'];
					name: string;
					phone: string;
				};
				Update: {
					action?: boolean | null;
					created_at?: string;
					deleted_at?: string | null;
					email?: string;
					id?: number;
					language?: Database['public']['Enums']['LanguageEnum'];
					name?: string;
					phone?: string;
				};
				Relationships: [];
			};
			Representative: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					description: number | null;
					id: number;
					image: string | null;
					name: number | null;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					image?: string | null;
					name?: number | null;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					description?: number | null;
					id?: number;
					image?: string | null;
					name?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Representative_description_fkey';
						columns: ['description'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Representative_name_fkey';
						columns: ['name'];
						isOneToOne: false;
						referencedRelation: 'Language';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			LanguageEnum: 'ENGLISH' | 'ARABIC' | 'KURDISH';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
		? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
		? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
		? PublicSchema['Enums'][PublicEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
		? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

// Schema: public
// Enums
export enum LanguageEnum {
	ENGLISH = 'ENGLISH',
	ARABIC = 'ARABIC',
	KURDISH = 'KURDISH'
}

// Tables
export type Card = Database['public']['Tables']['Card']['Row'];
export type InsertCard = Database['public']['Tables']['Card']['Insert'];
export type UpdateCard = Database['public']['Tables']['Card']['Update'];

export type Carousel = Database['public']['Tables']['Carousel']['Row'];
export type InsertCarousel = Database['public']['Tables']['Carousel']['Insert'];
export type UpdateCarousel = Database['public']['Tables']['Carousel']['Update'];

export type Event = Database['public']['Tables']['Event']['Row'];
export type InsertEvent = Database['public']['Tables']['Event']['Insert'];
export type UpdateEvent = Database['public']['Tables']['Event']['Update'];

export type Footer = Database['public']['Tables']['Footer']['Row'];
export type InsertFooter = Database['public']['Tables']['Footer']['Insert'];
export type UpdateFooter = Database['public']['Tables']['Footer']['Update'];

export type Language = Database['public']['Tables']['Language']['Row'];
export type InsertLanguage = Database['public']['Tables']['Language']['Insert'];
export type UpdateLanguage = Database['public']['Tables']['Language']['Update'];

export type Register = Database['public']['Tables']['Register']['Row'];
export type InsertRegister = Database['public']['Tables']['Register']['Insert'];
export type UpdateRegister = Database['public']['Tables']['Register']['Update'];

export type Representative = Database['public']['Tables']['Representative']['Row'];
export type InsertRepresentative = Database['public']['Tables']['Representative']['Insert'];
export type UpdateRepresentative = Database['public']['Tables']['Representative']['Update'];
