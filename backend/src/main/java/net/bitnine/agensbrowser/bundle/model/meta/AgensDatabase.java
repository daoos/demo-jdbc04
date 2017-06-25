package net.bitnine.agensbrowser.bundle.model.meta;

import java.util.ArrayList;
import java.util.List;

public class AgensDatabase {
	
/*
SELECT d.oid as db_oid, d.datname as db_name,
		pg_catalog.pg_get_userbyid(d.datdba) as db_owner,
        coalesce(null, s.description, '') as db_desc
FROM pg_database d
	LEFT OUTER JOIN pg_shdescription s on d.oid = s.objoid
where d.datname = 'test_ts'
order by db_oid;
 */
	public Long oid = -1L;
	public String name = "";
	public String owner = "";
	public String desc = "";
	
	public List<AgensGraph> graphs = new ArrayList<AgensGraph>();
	
}
